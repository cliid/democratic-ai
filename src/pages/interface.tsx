import Button from '@components/Button';
import { useState } from 'react';

const preferences = `
- [Foreign Policy] Do not interfere with things that are not about our affairs. I hate communists and fascists. 
- [International trade] Local workers should be preferred over global free trade.
- [Military] Pacifist; do not provoke war for meager reasons.
- [Fiscal/economic policy] I am a libertarian; do not spend money on foreign aids, partisan stuff, expanding the government, to help the poor, et cetera. Privatize stuff and leave things to the market if possible.
- [Educational policy] Decentralize education, and let gifted kids flourish. Implement more specialized education (gifted / nonacademic both).
- [National security] Do not expand the powers of NSA, CIA, FBI. Those organizations cause more harm than good, and they often surveil upon their own citizenry, which is bad.
`;

const initialPolicies = [
  `To deny asylum to members of a Communist or other totalitarian party, and for other purposes.`,
  `To establish a competitive bidding process for the relocation of the headquarters of Executive agencies, and for other purposes.`,
  `To extend the authority to provide employees of the United States Secret Service with overtime pay beyond other statutory limitations, and for other purposes.`,
  `To direct the Secretary of Education to carry out grant programs to encourage student participation in local government and volunteer service, and for other purposes.`,
  `To amend the Fair Debt Collection Practices Act to provide enhanced protection against debt collector harassment of members of the Armed Forces, and for other purposes.`,
  `To prevent ethnic cleansing and atrocities against ethnic Armenians, promote accountability for the same, protect and provide humanitarian assistance to Armenians in Armenia and Nagorno-Karabakh impacted by actions taken by the Government of Azerbaijan`,
  `To require the Director for Homeland Security Investigations of U.S. Immigration and Customs Enforcement to conduct annual assessments on threats posed to the United States by transnational criminal organizations, and for other purposes.`,
  `To expand the financial, health care, and educational benefits received by Peace Corps and AmeriCorps volunteers, and for other purposes.`,
  `To authorize the Federal Communications Commission to process applications for spectrum licenses from applicants who were successful bidders in an auction before the authority of the Commission to conduct auctions expired on March 9, 2023.`
];

export default function Interface() {
  const [query, setQuery] = useState('');
  const [policies, setPolicies] = useState(initialPolicies);

  return (
    <div className="tw-flex tw-flex-col tw-w-full tw-h-full tw-p-8 tw-gap-y-4">
      {policies.map((policy, index) => {
        return (
          <div key={index.toString()} className="tw-w-full tw-p-2 tw-border-2">
            {`Policy \#${index + 1}: ${policy}`}
          </div>
        );
      })}
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="tw-w-full tw-px-2 tw-py-1 tw-border-2 tw-rounded-md"
        placeholder="Enter your policy preferences!"
      ></textarea>
      <Button
        onClick={() => {
          fetch('/api/sort-policy', {
            method: 'POST',
            body: JSON.stringify({ policies, preferences: query })
          }).then((res) => {
            res.json().then((value) => {
              setPolicies(value.policies);
            });
          });
          setQuery('');
        }}
      >
        Submit
      </Button>
    </div>
  );
}
