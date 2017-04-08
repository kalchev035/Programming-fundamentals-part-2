const Article = require('mongoose').model('Article');

function validateArticle(articleArgs, req){
    let errorMsg = '';
    if (!req.isAuthenticated()){
        errorMsg = 'Sorry, you must be logged in to operate!';
    }
    else if (!articleArgs.title){
        errorMsg = 'Title is required!';
    }
    else if (!articleArgs.content){
        errorMsg = 'Content is required!';
    }
    return errorMsg;
}

module.exports = {
    createGet: (req, res) => {
        res.render('article/create');
    },
    createPost: (req, res) => {
        let articleArgs = req.body;

        let errorMsg = validateArticle(articleArgs, req);
        if (errorMsg){
            res.render('article/create', {error: errorMsg});
            return;
        }

        let userId = req.user.id;
        articleArgs.author = userId;

        Article.create(articleArgs).then(article => {
           req.user.articles.push(article.id);
           req.user.save(err => {
               if(err){
                    res.render('article/create', {
                        error: err.message
                    });
               }
               else{
                    res.redirect('/');
               }
           });
        });
    },
    detailsGet: (req, res) => {
        let id = req.params.id;

        Article.findById(id).populate('author').then(article => {
            if (!req.user){
                res.render('article/details', {article: article, isUserAuthorized: false});
                return;
            }

            req.user.isInRole('Admin').then(isAdmin => {
                let isUserAuthorized = isAdmin || req.user.isAuthor(article);

                res.render('article/details', {article: article, isUserAuthorized: isUserAuthorized});
            });

        });
    },

    editGet: (req, res) => {
        let id = req.params.id;

        Article.findById(id).then(article => {

            if ((req.user === undefined) || !req.user.isAuthor(article) || !req.user.isInRole('Admin')){
                res.render('home/index', {error: 'You cannot edit this article!'});
                return;
            }
            res.render('article/edit', article);
        });
    },
    editPost: (req, res) => {

        if ((req.user === undefined) || !req.user.isAuthor(article) || !req.user.isInRole('Admin')){
            res.render('home/index', {error: 'You cannot edit this article!'});
            return;
        }

        let id = req.params.id;
        let articleArgs = req.body;

        let errorMsg = validateArticle(articleArgs, req);

        if(errorMsg){
            res.render('article/edit', {error: errorMsg});
            return;
        }

        Article.update({_id: id}, {$set:{
            title: articleArgs.title,
            content: articleArgs.content}}).then(err => {
                res.redirect(`/article/details/${id}`);
        });
    },

    deleteGet: (req, res) => {

        if ((req.user === undefined) || !req.user.isAuthor(article) || !req.user.isInRole('Admin')) {
            res.render('home/index', {error: 'You cannot edit this article!'});
            return;
        }

        let id = req.params.id;

        Article.findById(id).then(article => {
            res.render('article/delete', article);
        });
    },

    deletePost: (req, res) => {

        if ((req.user === undefined) || !req.user.isAuthor(article) || !req.user.isInRole('Admin')) {
            res.render('home/index', {error: 'You cannot edit this article!'});
            return;
        }

        let id = req.params.id;

        Article.findByIdAndRemove(id).then(article => {
            let index = req.user.articles.indexOf(article.id);

            req.user.articles.splice(index, 1);

            req.user.save(err => {
                if(err){
                     res.redirect('/', {error: err.message});
                }
                else{
                    req.redirect('/');
                }
            });
        });
    }
};