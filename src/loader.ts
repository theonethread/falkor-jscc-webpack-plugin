import jscc from "jscc";
import JsccOptions = jscc.Options;

export default function (source: string, _inputSourceMap: any) {
    const options: JsccOptions = this.getOptions(this.loaderContext);
    const { code, map } = jscc(source, this.resourcePath, options);
    this.callback(null, code, map);
}
