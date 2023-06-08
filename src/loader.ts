import jscc from "jscc";
import JsccOptions = jscc.Options;
import type { LoaderContext } from "webpack";

export default function (this: LoaderContext<JsccOptions>, source: string, _inputSourceMap: any): void {
    const options: JsccOptions = this.getOptions(this);
    const { code, map } = jscc(source, this.resourcePath, options);
    this.callback(null, code, map);
}
