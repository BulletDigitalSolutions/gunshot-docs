
# Middleware

## Entity

The entity middleware will find an entity from a route parameter, and add it to the request object. 

To use it, register it in your `app/Http/Kernel.php` file:

```php
protected $routeMiddleware = [
    // ...
    'entity' => \BulletDigitalSolutions\Gunshot\Middleware\Entity::class,
];
```

Then, in your routes, you can use it like this:

```php
Route::get('Blog/{blog}', 'Blogs\Core\Http\Controllers\Front\BlogController@show')->name('show')->middleware(['entity:Blog']);
```

The first parameter is the name of the entity to match. This way if you visit /Blog/1, it will find the Blog with an ID of 1, and add it to the request object.

If you would like to match on something other than the ID, you can do the following:

```php
Route::get('Blog/{blog}', 'Blogs\Core\Http\Controllers\Front\BlogController@show')->name('show')->middleware(['entity:Blog,slug']);
```

This will match on the slug instead of the ID. If you visit /Blog/my-blog-post, it will find the Blog with a slug of 'my-blog-post', and add it to the request object.

If you would like to user a different route parameter, you can use the third parameter do the following:

```php
Route::get('Blog/{post}', 'Blogs\Core\Http\Controllers\Front\BlogController@show')->name('show')->middleware(['entity:Blog,slug,post']);
```

This will match on the slug, but use the route parameter 'post' instead of 'blog'. If you visit /Blog/my-blog-post, it will find the Blog with a slug of 'my-blog-post', and add it to the request object.

### Retrieving the Entity

Once the entity has been added to the request object, you can retrieve from your controller by getting it from the request object:

```php
$blog = $request->get('blog');
```

The name of the request parameter is the name of the entity, in snake_case. If you would like the request parameter to be something else, you can use the fourth parameter:

```php
Route::get('Blog/{post}', 'Blogs\Core\Http\Controllers\Front\BlogController@show')->name('show')->middleware(['entity:Blog,slug,post,blog_post']);
```

```php
$blog = $request->get('blog_post');
```

## My

The `my` middleware works exactly the same as the entity middleware, except it will call the `isOwnedBy()` method on the entity, and if this returns a false, it will throw a 404 error to the user.

To use it, register it in your `app/Http/Kernel.php` file:

```php
protected $routeMiddleware = [
    // ...
    'my' => \BulletDigitalSolutions\Gunshot\Middleware\My::class,
];
```

Then, in your routes, you can use it like this:

```php
Route::get('Blog/{blog}', 'Blogs\Core\Http\Controllers\Front\BlogController@show')->name('show')->middleware(['my:Blog']);
```

And add the isOwnedBy method to your blog entity:

```php
public function isOwnedBy(User $user): bool
{
    return $this->getUser() === $user;
}
```

Then, if you visit /Blog/1, and the user is not the owner of the blog, it will throw a 404 error. Otherwise, it will add the blog to the request object.
```php
$blog = $request->get('blog');
```

All the additional paramaters work the same as the entity middleware, so you can override the field to match on, the route parameter, and the request parameter.