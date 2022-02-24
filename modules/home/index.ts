import Main from "./components/Main";
import { register, Model, helper } from "reaux-next";
import { State } from "./type";

const initialState: State = {
  name: "home"
};

class ActionHandler extends Model<State> {
  @helper.loading()
  async onReady() {
    // 对应next.js中的getInitialProps方法
    console.info("home");
    await this.setState({ name: "new name" });
  }
}

export const { actions, View } = register(
  new ActionHandler("home", initialState),
  Main
);
