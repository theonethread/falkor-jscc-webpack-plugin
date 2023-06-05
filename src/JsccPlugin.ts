import { Compilation, Compiler, NormalModule } from "webpack";
import jscc from "jscc";
import JsccOptions = jscc.Options;

interface PluginOptions {
    extensions?: string[];
    values?: {
        [key: string]: any;
    };
    excludes?: RegExp[];
}

export default class JsccPlugin {
    private readonly NS = "JsccPlugin";
    private excludesMatcher: RegExp[];
    private includesMatcher: RegExp;

    private options: PluginOptions = {
        extensions: ["ts", "less", "jsonc"],
        values: {
            _PLATFORM: "web"
        },
        excludes: [/node_modules/]
    };

    constructor(options: PluginOptions) {
        this.options = Object.assign(this.options, options);
        this.excludesMatcher = this.options.excludes;
        this.includesMatcher = new RegExp("\\.(" + this.options.extensions.join("|") + ")$");
    }

    public apply(compiler: Compiler): void {
        compiler.hooks.thisCompilation.tap(this.NS, (compilation: Compilation) => this.setupPlugin(compilation));
    }

    private setupPlugin(compilation: Compilation): void {
        NormalModule.getCompilationHooks(compilation).loader.tap(this.NS, (_loaderContext: any, module: any) =>
            this.hookPlugin(module)
        );
    }

    private hookPlugin(module: NormalModule): void {
        const userRequestBase = module.userRequest.split("?")[0];
        if (
            typeof module.userRequest !== "string" ||
            (this.excludesMatcher?.length && this.excludesMatcher.find((regex) => regex.test(userRequestBase))) ||
            (this.includesMatcher && !this.includesMatcher.test(userRequestBase))
        ) {
            return;
        }

        const options: JsccOptions = { values: this.options.values };
        module.loaders.push({
            options,
            loader: require.resolve("./loader"),
            ident: undefined,
            type: undefined
        });
    }
}
