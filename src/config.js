global.SALT_KEY = 'f5b99242-6504-4ca3-90f2-05e78e5761ef';
global.EMAIL_TMPL = 'Olá, <strong>{0}</strong>. Seja bem vindo ao Node Store Api.';

module.exports = {
    connectionString: 'mongodb+srv://admin:123@cluster0.c8pww.mongodb.net/Cluster0',
    sendgridKey: 'apiKey',
    containerStorageConnectionString: 'ConnectionStringAzureStorage',
    baseUrlAzureStorage: 'https://nodeapistore.blob.core.windows.net',
}