
# Installation


Gunshot is available as a composer package, you can install it in your laravel application using:

```bash
composer require bulletdigitalsolutions/gunshot
```

It will automatically register the service provider, so you will not need to do anything else.


## Configuration

You can publish the configuration file using:

```bash
php artisan vendor:publish --provider="BulletDigitalSolutions\Gunshot\GunshotServiceProvider"
```

In config/gunshot.php you can configure the following options:

### Templating Engine

- Type: `string`
- Default: `blade`
- Options: `blade`, `inertia`
- Description: The format that should be used for the module:make command