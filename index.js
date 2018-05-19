const path = require('path');
const fg = require('fast-glob');

function requireModels(database, folder) {
    const index = path.join(folder, 'index.js');
    const models = fg
        .sync([`!${index}`, path.join(folder, '**/*.js')])
        .reduce((acc, file) => {
            const name = path.basename(file, path.extname(file));
            const model = require(file)(database);

            return Object.assign(acc, { [name]: model });
        }, {});

    Object
        .keys(models)
        .map(name => models[name])
        .filter(model => model.associate)
        .forEach(model => model.associate(models));

    return models;
}

module.exports = requireModels;
