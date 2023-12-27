const {
    PORT=80,
    NODE_ENV="development",
    DOMAIN="http://localhost",
    SESSION_SECRET="nyan-poptart-cat",
    USE_SSL=false,
    DATABASE_URL
} = process.env

if(!DATABASE_URL){
    console.error("DATABASE_URL is not set")
}

export {
    PORT,
    DOMAIN,
    NODE_ENV,
    SESSION_SECRET,
    USE_SSL,
    DATABASE_URL,
}