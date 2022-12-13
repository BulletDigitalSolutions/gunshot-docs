
# Traits

Gunshot includes a number of traits that can be used to add functionality to your models.

## Activatable

The activatable trait will add a `is_active` column to your model, and will add a scope to your model to retrieve only active models. 

To use it, add the following to your model:

```php
use BulletDigitalSolutions\Gunshot\Traits\Activatable;

class Blog extends Model
{
    use Activatable;
}
```

Then, you can use isActive and setIsActive to set and retrieve the value of the is_active column:

```php
$blog->isActive(); // Returns true or false
```

```php
$blog->setIsActive(true); // Sets the is_active column to true
```

## Identifiable

The identifiable trait will add a `identifier` column to your model, and will add a scope to your model to retrieve models by their identifier. This requires Webspatser\Uuid to be installed.

To use it, add the following to your model:

```php
use BulletDigitalSolutions\Gunshot\Traits\Identifiable;

class Blog extends Model
{
    use Identifiable;
}
```

Then, UUIDs are set automatically when creating a new entity. You can retrieve the identifier using the getUuid method:

```php
$blog->getUuid(); // Returns the identifier
```

## Timestampable

The timestampable trait will add a `created_at` and `updated_at` column to your entity. These will be updated automatically when the entity is created or updated. This requires Gedmo\Annotations to be installed.

To use it, add the following to your model:

```php
use BulletDigitalSolutions\Gunshot\Traits\Timestampable;

class Blog extends Model
{
    use Timestampable;
}
```

Then, you can use getCreatedAt and getUpdatedAt to retrieve the values of the columns:

```php
$blog->getCreatedAt(); // Returns the created_at column
```

```php
$blog->getUpdatedAt(); // Returns the updated_at column
```



