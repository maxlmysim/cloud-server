import {applyMiddleware, combineReducers, createStore} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import thunk from "redux-thunk";
import userReducer from "./userReducer";
import fileReducer from "./fileReducer";
import dirReducer from "./dirReducer";
import loadReducer from "./loadReducer";
import appReducer from "./appReducer";


const rootReducer = combineReducers({
    user: userReducer,
    files: fileReducer,
    dir: dirReducer,
    load: loadReducer,
    app: appReducer
});

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));