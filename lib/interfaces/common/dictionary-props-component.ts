import { Dictionary } from "@/locales/dictionary";

export type AppComponentDictionaryProps = {
  dictionary: Dictionary;
  locale: string;
};
export type AppComponentDictionaryPropsWithId = {
  dictionary: Dictionary;
  locale: string;
  id: string;
};

export type AppComponentProps = {
  children: React.ReactNode;
  dictionary: Dictionary;
  locale: string;
};
export type BasePageProps = {
  params: {
    locale: string;
  };
}

export type BasePagePropsWithId = {
  params: {
    locale: string;
    id: string;
  };
}
