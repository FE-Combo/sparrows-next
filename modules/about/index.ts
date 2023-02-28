import Main from "./components/Main";
import { register, Model } from "reaux-next";
import { State } from "./type";

const initialState: State = {
  name: "about",
};

class ActionHandler extends Model<State> {
  async onReady() {
    console.info("about");
  }
}

export const { actions, View } = register(
  new ActionHandler("about", initialState),
  Main
);
