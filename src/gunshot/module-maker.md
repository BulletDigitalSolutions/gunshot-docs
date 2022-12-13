
# Module Maker

## Modules

Modules are a way to organize your code. They are a way to group together related code and to make it easier to reuse. Modules are also a way to make your code more readable and easier to maintain.

In Gunshot, we create a modules folder in your App/Modules folder. Inside this folder, we create a folder for each module. Inside each module folder, we create a folder for each module component. For example, if we have a module called `Blog`, we will have a folder called `Blog` inside the modules folder. Inside the `Blog` folder, we will have a folder called `Controllers`, a folder called `Views`, and so on.

Each module will generally relate to one doctrine entity, and include the views, repositories, controllers, and other components that are related to that entity.

We tend to structure it as follows:

- App
  - Modules
    - Blog
      - Core 
        - Contracts
        - Controllers
        - Views
        - Repositories
        - Services
        - Events
        - Transformers
        - Factories
        - Jobs
        - Http
          - Controllers
          - Requests
        - Facades
      - Comments
        - Core
          - Contracts
          - ...

## Configuration

The module will register any contracts in the AppServiceProvider. It will also register any events in EventServiceProvider and Facades in config/app.php. To do this is uses comments to know where to put them, so it is important to add these comments before running any commands.

### AppServiceProvider

The AppServiceProvider required Generated Imports and End Generated Imports comments. Then, it will add contracts in repoBindings, searchableRepoBindings, filterBindings and searchableFilterBindings, so ensure you have these.

```php
<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

// Generated Imports
// End Generated Imports

class AppServiceProvider extends ServiceProvider
{
    protected $repoBindings = [
    ];
    
    protected $searchableRepoBindings = [
    ];
    
    protected $filterBindings = [
    ];
    
    protected $searchableFilterBindings = [
    ];
    
    public function register()
    {
        foreach ($this->getRepoBindings() as $binding) {
            [$contract, $repository, $model] = $binding;

            $this->app->bind($contract, function ($app) use ($repository, $model) {
                return new $repository($app['em'], $app['em']->getClassMetaData($model));
            });
        }
        
        foreach ($this->getSearchableRepoBindings() as $binding) {
            [$contract, $repository, $model] = $binding;

            $this->app->bind($contract, function ($app) use ($repository, $model) {
                return new $repository(
                    $app['em'],
                    $app['em']->getClassMetaData($model),
                    $app->make(EngineManager::class)
                );
            });
        }

        foreach ($this->getFilterBindings() as $binding) {
            [$filter, $contract, $repository, $model] = $binding;

            $this->app->bind($contract, function ($app) use ($filter, $model, $repository) {
                return new $filter(
                    new $repository($app['em'], $app['em']->getClassMetaData($model)),
                    app(Request::class)
                );
            });
        }
        
        foreach ($this->getSearchableFilterBindings() as $binding) {
            [$filter, $contract, $repository, $model] = $binding;

            $this->app->bind($contract, function ($app) use ($filter, $model, $repository) {
                return new $filter(
                    new $repository(
                        $app['em'],
                        $app['em']->getClassMetaData($model),
                        $app->make(EngineManager::class)
                    ),
                    app(Request::class)
                );
            });
        }
    }
    
    public function getRepoBindings(): array
    {
        return $this->repoBindings;
    }
    
    public function getSearchableRepoBindings(): array
    {
        return $this->searchableRepoBindings;
    }
    
    public function getFilterBindings(): array
    {
        return $this->filterBindings;
    }

    public function getSearchableFilterBindings(): array
    {
        return $this->searchableFilterBindings;
    }
}
```

### EventServiceProvider

The EventServiceProvider requires two sets of comments:

```php
<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

// Generated Imports
// End Generated Imports

class EventServiceProvider extends ServiceProvider

    protected $listen = [
        // Generated Events
        // End Generated Events
    ];
```

### App config

The config/app.php file requires comments in the aliases

```php
<?php

return [
    ...

    'aliases' => [
        ...
        // Facades
        // End Facades
    ],
```

## Commands

### Module Maker

The module maker command is used to create a new module. It will create a new folder inside the modules folder and create the necessary files inside it.

```bash
php artisan module:make Blog Blog\Core
```

The first parameter is the name of the entity you are creating a module for, and the second is the location of the module (inside App\Modules). The command will then ask the following questions.

### Would you like to create a view folder? [yes|no]

This will create a views folder inside the module folder. If you are using blade, this will register the views folder in config/view.php.

### Would you like to create a repository? [yes|no]

This will create a repository and contract inside the module folder. It will also register the repository in the AppServiceProvider.

### Would you like to create a facade? [yes|no]

This will create a facade inside the module folder. It will also register the facade in config/app.php.

### Would you like to create a transformer? [yes|no]

This requires the `league/fractal` package to be installed. It will create a transformer inside the module folder.

### Would you like to create a filter? [yes|no]

This will create a filter inside the module folder. It will also register the filter in the AppServiceProvider.

### Would you like to create any events/listeners? [yes|no]

This will prompt you to create as many Events and Listeners you want. It will also register the events in the EventServiceProvider.

### Would you like to create any jobs? [yes|no]

This will prompt you to create as many jobs you want.

### Would you like to create any notifications? [yes|no]

This will prompt you to create as many notifications you want.

### Would you like to create any value objects? [yes|no]

This will prompt you to create as many value objects you want.

### Would you like to create any requests? [yes|no]

This will prompt you to create as many requests you want. You can prefix the name of the request to create a folder, for example put Front\CreatePostRequest to create a CreatePostRequest inside a Front folder.

### Would you like to create any controllers? [yes|no]

This will prompt you to create as many controllers you want. You can prefix the name of the controller to create a folder, for example put Front\CreatePostController to create a CreatePostController inside a Front folder.

