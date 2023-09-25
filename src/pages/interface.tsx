import Button from '@components/Button';
import { useState } from 'react';

const initialPreferences = [
  '[Foreign Policy] Do not interfere with things that are not about our affairs. I hate communists and fascists.',
  '[International trade] Local workers should be preferred over global free trade.',
  '[Military] Pacifist; do not provoke war for meager reasons.',
  '[Fiscal/economic policy] I am a libertarian; do not spend money on foreign aids, partisan stuff, expanding the government, to help the poor, et cetera. Privatize stuff and leave things to the market if possible.',
  '[Educational policy] Decentralize education, and let gifted kids flourish. Implement more specialized education (gifted / nonacademic both).',
  '[National security] Do not expand the powers of NSA, CIA, FBI. Those organizations cause more harm than good, and they often surveil upon their own citizenry, which is bad.'
];

const initialPolicies = [
  'To require agencies to use the term "Taiwan" instead of "Chinese Taipei", and for other purposes.',
  'To provide appropriations for the Food and Nutrition Act of 2008 during the first lapse in appropriations in a fiscal year.',
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
  const [policies, setPolicies] = useState(initialPolicies);
  const [formValues, setFormValues] = useState(
    initialPreferences.map((value) => {
      return { preference: value };
    })
  );

  let handleChange = (i: number, e: any) => {
    let newFormValues = [...formValues];
    newFormValues[i].preference = e.target.value;
    setFormValues(newFormValues);
  };

  let addFormFields = () => {
    setFormValues([...formValues, { preference: '' }]);
  };

  let removeFormFields = (i: number) => {
    let newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
  };

  let handleSubmit = (e: any) => {
    e.preventDefault();
    alert(JSON.stringify(formValues));
  };

  return (
    <div className="tw-grid tw-w-screen tw-h-screen tw-grid-flow-col tw-grid-cols-2">
      <div className="tw-flex tw-flex-col tw-w-full tw-h-screen tw-p-8 tw-overflow-y-scroll">
        <h2 className="tw-mb-4 tw-text-2xl tw-font-bold">List of Policies</h2>
        <div className="tw-flex tw-flex-col tw-w-full tw-h-full tw-overflow-y-scroll tw-gap-y-4">
          {policies.map((policy, index) => {
            return (
              <div key={index.toString()} className="tw-w-full tw-p-2 tw-border-2">
                {`Policy \#${index + 1}: ${policy}`}
              </div>
            );
          })}
        </div>
      </div>
      <div className="tw-flex tw-flex-col tw-p-8 tw-gap-y-4">
        {formValues.map((element, index) => {
          return (
            <div key={index}>
              <input
                value={element.preference}
                key={index.toString()}
                onChange={(e) => handleChange(index, e)}
                className="tw-w-full tw-px-2 tw-py-1 tw-border-2 tw-rounded-md tw-h-11"
                placeholder="Enter your policy preferences!"
              />
              {index ? (
                <button
                  type="button"
                  className="button remove"
                  onClick={() => removeFormFields(index)}
                >
                  Remove
                </button>
              ) : null}
            </div>
          );
        })}
        <button type="button" onClick={() => addFormFields()}>
          Add New Preference
        </button>
        <Button
          onClick={() => {
            console.log(formValues.map((value) => value.preference).join('\n'));
            fetch('/api/sort-policy', {
              method: 'POST',
              body: JSON.stringify({
                policies,
                preferences: formValues.map((value) => value.preference)
              })
            }).then((res) => {
              res.json().then((value) => {
                setPolicies(value.policies);
              });
            });
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
