import React from "react";
import Main from "./components/Main";
import MainH5 from "./components-h5/Main";
import { start, Model, PageContext } from "reaux-next";
import BaseApp from "next/app";
import { State } from "./type";

export interface NextAppProps<T = any> {
  Component: React.ComponentType<T>; // router component
  pageProps: object; // router component props
  isMobile: boolean;
}

const initialState: State = {
  name: "main",
};

class ActionHandler extends Model<State> {
  async onReady(context: PageContext) {
    return { isMobile: context.req?.headers["user-agent"]?.includes("Mobile") };
  }
}

const NextMain = (props: NextAppProps) => {
  return props.isMobile ? <MainH5 {...props} /> : <Main {...props} />;
};

export const { actions, View } = start(
  new ActionHandler("main", initialState),
  NextMain,
  BaseApp
);
