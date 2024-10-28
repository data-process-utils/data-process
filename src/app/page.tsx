'use client';
// import {Button} from "@mantine/core";

import {useTranslator} from "@/hooks/use-translator";
// import Head from "next/head";

export default function Home() {
  const {translate} = useTranslator()

  return (
    <div>

      <p>{translate('json_file_size_max_message')}</p>
      {/*<Button>Teste</Button>*/}
    </div>
  );
}
