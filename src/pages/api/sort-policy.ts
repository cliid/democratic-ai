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
    const { policies, preferences }: { policies: string[]; preferences: string[] } = JSON.parse(
      req.body
    );
    res.status(200).json({ policies: await sortPolicies(policies, preferences) });
  }
}

async function sortPolicies(policies: string[], preferences: string[]) {
  const policiesWithSimilarity = policies.map((policy) => ({ policy, aggregateSimilarity: 0 }));
  for (let i = 0; i < policies.length; ++i) {
    for (let j = 0; j < preferences.length; ++j) {
      let query = `
  Consistently output from a scale of 0 to 1 of real numbers, where 0 is HELL NO and 1 is HELL YES, about whether the following policy fits the user's preference.
The Policy: "${policies[i]}"
The Preference: "${preferences[j]}"

ONLY OUTPUT THE NUMBER.
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
      const regex = new RegExp(/((\+|-)?([0-9]+)(\.[0-9]+)?)|((\+|-)?\.?[0-9]+)/g);
      const matches = result.match(regex);
      if (matches == null) {
        return policies;
      }
      // must hold; otherwise abort.
      assert(matches.length === 1);
      const similarity = Number(matches[0].trim());
      policiesWithSimilarity[i].aggregateSimilarity += similarity;
    }
  }
  return policiesWithSimilarity
    .sort((a, b) => b.aggregateSimilarity - a.aggregateSimilarity)
    .map((value) => value.policy);
}
