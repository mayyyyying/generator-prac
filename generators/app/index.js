const Generator = require('yeoman-generator');
const prompts = require("./prompts");
const chalk = require("chalk");
const alaudaBanner = require("../../lib/alauda-banner");

module.exports = class extends Generator {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    // This method adds support for a `--babel` flag
    this.option("config", {
            alias: "c",
            desc: "配置文件地址",
            type: String
        });

    //this.scriptSuffix = this.options.config ? ".config" : ".js";
    this.getDockerConfigJson = this.getDockerConfigJson.bind(this);
    this._writeTpl = this._writeTpl.bind(this);
    this._translateProps = this._translateProps.bind(this);
  }

/*
  method1() {
    this.log('method 1 just ran');
  }

  method2() {
    this.log('method 2 just ran');
  }
*/

  async prompting() {
    
    const answers = await this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your project name",
        default: this.appname // Default to current folder name
      },
      {
        type: "confirm",
        name: "cool",
        message: "Would you like to enable the Cool feature?"
      }
    ]);
    
    this.log(alaudaBanner(`Welcome to use Spring Cloud For scaffolder`));
    const configFile = this.options.config;
    if (configFile && fs.existsSync(configFile)) {
      const data = fs.readFileSync(configFile, "utf8");
      this.props = JSON.parse(data);
    }else{
      this.props = await this.prompt([
        {
          type: "confirm",
          name: "bootstrap",
          message: "Would you like to enable the Cool features?",
          default: true
        }
      ]);
  
      if (this.props.bootstrap) {
        prompts.forEach(o => {
          if (typeof o.default !== "undefined") {
              this.props[o.name] = o.default;
          }
        });
        this.props = Object.assign(
          {},
          this.props,
          await this.prompt(prompts)
        );
      }
    }
    //this.log("app name", answers.name);
    //this.log("cool feature", answers.cool);
  }

  _translateProps() {
    Object.keys(this.props).forEach(key => {
        this.props[decamelize(key).toUpperCase()] = this.props[key];
    });
  }

  getDockerConfigJson() {
    const {
        dockerUrl,
        dockerPort,
        dockerUsername,
        dockerPassword,
        projectName
    } = this.props;
    if (!dockerUrl || !dockerPort || !dockerUsername || !dockerPassword)
        return "";
    const auth = base64.encode(`${dockerUsername}:${dockerPassword}`);
    const authsKey = `${dockerUrl}:${dockerPort}`;
    this.props.dockerImage = `${authsKey}/${projectName}:latest`;
    return base64.encode(
        JSON.stringify({
            auths: {
                [authsKey]: {
                    userName: dockerUsername,
                    password: dockerPassword,
                    email: "",
                    auth
                }
            }
        })
    );
  }

  _writeTpl(dirName) {
    let { packageName, projectName, messageQueuePassword } = this.props;

    this.props.upperProjectName = camelcase(projectName, {
        pascalCase: true
    });
    this.props.lowerProjectName = camelcase(projectName);
    this.props.packagePath = packageName.toLowerCase().replace(/\./g, "/");
    this.props.dockerConfigJson = this.getDockerConfigJson();
    this.props.messageQueuePasswordBase64 = base64.encode(
        messageQueuePassword
    );

    this._translateProps();

    let templateDir = this.templatePath(dirName);
    let me = this;
    return new Promise(function(resolve) {
        let walker = walk.walk(templateDir);

        walker.on("file", function(roots, stat, next) {
            let rootPath = path
                .relative(templateDir, roots)
                .replace(/\${PACKAGE_PATH}/g, me.props.packagePath);
            let destRoot = `${projectName}/${rootPath}`;
            let destName = stat.name;

            if (ignoreFiles(rootPath, me.props, next)) return;

            Object.keys(me.props).forEach(key => {
                destRoot = destRoot.replace(
                    "${" + key + "}",
                    me.props[key]
                );
                destName = destName.replace(
                    "${" + key + "}",
                    me.props[key]
                );
            });

            me.fs.copyTpl(
                me.templatePath(`${roots}/${stat.name}`),
                me.destinationPath(`${destRoot}/${destName}`),
                me.props
            );
            next();
        });

        walker.on("end", function() {
            resolve();
        });
    });
  }

  // writing() {
  //   if (!this.props.bootstrap) return;
  //   return this._writeTpl("microservice");
  // }

  writing() {
    this.log("Project Name: ", this.props.name);
    this.log("Cool Feature Enabled: ", this.props.cool); // user answer `cool` used
  }

};
