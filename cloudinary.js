const cloudinary = require('cloudinary');
const  promiseImpl  = require('ejs');
const  resolve  = require('path');

cloudinary.config({
    cloud_name: 'dckj2yfap',
    api_key: '693332219167892',
    api_secret: 'acUf4mqnUBJCwsovIz-Ws894NGY'
});

exports.uploads = (file,folder) => {
    return new Promise(resolve => {
        // console.log(resolve);
        cloudinary.Uploader.uploads(file,(result) => {
            resolve({
                url : result.url,
                id : result.public_id
            })
        }, {
            resource_type : 'auto',
            folder: folder
        })
    })
}