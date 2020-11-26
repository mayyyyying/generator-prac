const chalk = require("chalk");
const serviceType = _ => "microservice";
const prompts = [
    {
        type: "input",
        name: "projectName",
        message: "Input your project name: ",
        validate: input => {
            if (!input) {
                return chalk.red("project name cannot be empty.");
            }
            if (!/^[a-z]+[a-z0-9-_]*[a-z0-9]+$/.test(input)) {
                return chalk.red(
                    "工程名称只能包含字母、数字短线（-）或者下划线（_），且必须以英文字母开头，英文字母或数字结尾"
                );
            }
            return true;
        }
    },
    {
        type: "input",
        name: "projectDescribe",
        message: "请输入您的工程描述："
    },
    {
        type: "input",
        name: "mavenGroupId",
        message: "请输入 Maven Group Id：",
        validate: input => {
            if (!input) return chalk.red("Maven Group Id 不能为空");
            if (!/^[a-z]+[a-z0-9.]*[a-z0-9]+$/.test(input)) {
                return chalk.red(
                    "Maven Group Id 只能包含小写英文、数字或点（.），且必须以英文字母开头，英文字母或数字结尾"
                );
            }

            return true;
        }
    },
    {
        type: "input",
        name: "mavenArtifactId",
        message: "请输入 Maven Artifact Id：",
        validate: input => {
            if (!input) return chalk.red("Maven Artifact Id 不能为空");
            if (!/^[a-z]+[a-z0-9-_]*[a-z0-9]+$/.test(input)) {
                return chalk.red(
                    "Maven Artifact Id 只能包含小写英文、数字、短线（-）或者下划线（_），且必须以英文字母开头，英文字母或数字结尾"
                );
            }

            return true;
        }
    },
    {
        type: "input",
        name: "packageName",
        message: "请输入包名：",
        validate: input => {
            if (!input) return chalk.red("包名不能为空");
            if (!/^[a-z]+[a-z0-9.]*[a-z0-9]+$/.test(input)) {
                return chalk.red(
                    "包名只能包含小写英文、数字或点（.），且必须以英文字母开头，英文字母或数字结尾"
                );
            }

            return true;
        }
    },
    {
        type: "input",
        name: "k8sNamespace",
        message:
            "请输入网关要部署的命名空间名称(如不部署在 Kubernetes 可跳过)：",
        validate: input => {
            if (!input) return true;
            if (!/^[a-z]+[a-z0-9-]*[a-z0-9]+$/.test(input)) {
                return chalk.red(
                    "命名空间名称只能包含字母、数字短线（-），且必须以英文字母开头，英文字母或数字结尾"
                );
            }

            return true;
        }
    },
    {
        type: "confirm",
        name: "circuitBreakerEnabled",
        //message: "hello",
        message: props => `您的${serviceType(props)}是否需要支持熔断降级？`,
        default: true
    },
    {
        type: "confirm",
        name: "rateLimitEnabled",
        message: props => `您的${serviceType(props)}是否需要支持限流？`,
        default: true
    }
    
];

module.exports = prompts;