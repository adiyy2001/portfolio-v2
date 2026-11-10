import React from 'react';
import BudujZdrowo from '../../components/budujzdrowo';
import Close from '../../components/close';
import Seo from '../../components/seo';

export default function BudujZdrowoCase() {
  return (
    <>
      <BudujZdrowo />
      <Close lang="pl" edition="cli" />
    </>
  );
}

export const Head = () => (
  <Seo
    lang="pl"
    path="/archive/budujzdrowo/"
    title="Strona firmy budującej domy szkieletowe, Adrian Turbiński"
    description="Strona wykonawcy domów szkieletowych z Mazowsza: kalkulator kosztów, 18 realizacji ze zdjęciami i formularz kontaktowy. Zobacz, co zbudowałem."
    client={{ name: 'Zdrowa Budowa', site: 'https://budujzdrowo.pl/' }}
  />
);
