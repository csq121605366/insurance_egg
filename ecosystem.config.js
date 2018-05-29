module.exports = {
    apps: [
        {
            name: "health_happy",
            script: "./index.js",
            watch: false,
            env: {

            },
            prod: {
                "NODE_ENV": "production",
                "EGG_SERVER_ENV": "prod",
                "WORKERS": 4
            }
        }
    ]
}