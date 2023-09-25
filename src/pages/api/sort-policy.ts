import assert from 'assert';
import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? ''
});

type ResponseData = {
  policies: string[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method === 'POST') {
    const { policies, preferences }: { policies: string[]; preferences: string } = JSON.parse(
      req.body
    );
    res.status(200).json({ policies: await sortPolicies(policies, preferences) });
  }
}

async function sortPolicies(policies: string[], preferences: string) {
  let query = `For each the following list of legislations with its corresponding label of the form [x] (called the "legislation number") being attached next to it, output a "preference index" that ranges from 0 to 1, and make sure that a higher preference index indicates that the legislation aligns more with the user's preferences, and a lower preference index indicates that the given legislation does not match the user's preferences.
YOU MUST give the numbers so that the average of the preference indices out of all legislations is 0.5.

The output should be of the form "[x] [score]" for each legislation on each line, where [x] is the legislation number and [score] is the preference index, in a computer-parseable format. Do not output any other text, but solely the "[x] [score]" part. Strictly adhere to the given rules.

The user's preferences are as follows:

${preferences}

The legislations are as follows:
${policies
  .map((policy, index) => {
    return `- [${index}] ${policy}`;
  })
  .join('\n')}
`;

  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: query }],
    model: 'gpt-3.5-turbo'
  });

  if (!chatCompletion.choices[0].message.content) {
    // default behavior - don't sort when error
    return policies;
  }

  const result = chatCompletion.choices[0].message.content;

  const regex = new RegExp(/(\[[0-9]+\]) ((\+|-)?([0-9]+)(\.[0-9]+)?)|((\+|-)?\.?[0-9]+)/g);
  const matches = result.match(regex);
  if (matches == null) {
    return policies;
  }

  // must hold; otherwise abort.
  assert(matches.length === policies.length);

  return matches
    .map((str, index) => {
      const first = str.split(' ')[0].trim();
      const preference = Number(str.split(' ')[1].trim());
      const policyNo = Number(first.slice(1, first.length - 2));
      return { policy: policies[index], preference };
    })
    .sort((a, b) => b.preference - a.preference) // sort in decreasing order of preference (policy with preference 1 goes first)
    .map((value) => value.policy);
}
