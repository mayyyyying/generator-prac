var Generator = require('yeoman-generator');

//Acquiring typings...
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
    /*
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
    */

    this.answer0 = await this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your project name",
        default: this.appname
      }
    ]);

    this.answers1 = await this.prompt([
      {
        type: "confirm",
        name: "cool",
        message: "Would you like to enable the Cool feature?"
      }
    ]);

    //this.log("app name", answers.name);
    //this.log("cool feature", answers.cool);
  }

  writing() {
    this.log("Project Name: ", this.answer0.name);
    this.log("Cool Feature Enabled: ", this.answers1.cool); // user answer `cool` used
  }

};
