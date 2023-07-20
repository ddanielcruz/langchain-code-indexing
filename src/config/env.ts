import env from 'env-var'

export const GH_REPOSITORY = env.get('GH_REPOSITORY').required().asString()
export const GH_BRANCH = env.get('GH_BRANCH').default('main').asString()
export const GH_ACCESS_TOKEN = env.get('GH_ACCESS_TOKEN').asString()
