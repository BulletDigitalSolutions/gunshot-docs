
# Pivot Repositories

Pivot repositories add various features to Many-To-Many relationships. 

Doctrine does not allow you to add any fields to pivot tables in Many-To-Many relationships, and therefore we have been creating ManyToOne relationships to an entity for the Pivot, and then a OneToMany to the child entity.

For example:

App\Entities\Blog.php:

```php
<?php

namespace App\Entities;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Table()
 * @ORM\Entity
 */
class Blog extends BaseEntity
{
    /**
     * @ORM\Column(type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    protected $id;
    
    /**
     * @ORM\Column(name="name", type="string", nullable=false)
     */
    protected $name = '';

    ...
    
    /**
     * @ORM\OneToMany(targetEntity="BlogTags", mappedBy="blog")
     */
    protected $tags;
}
```

App\Entities\Tags.php
```php
<?php

namespace App\Entities;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Table()
 * @ORM\Entity
 */
class Tag extends BaseEntity
{
    /**
     * @ORM\Column(type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    protected $id;
    
    /**
     * @ORM\Column(name="name", type="string", nullable=false)
     */
    protected $name = '';

    ...
    
    /**
     * @ORM\OneToMany(targetEntity="BlogTags", mappedBy="blog")
     */
    protected $blogs;
```

App\Entities\BlogTags.php
```php
<?php

namespace App\Entities;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Table()
 * @ORM\Entity
 */
class BlogTags extends BaseEntity
{
    /**
     * @ORM\Column(type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    protected $id;
    
    /**
     * @ORM\ManyToOne(targetEntity="Blog")
     * @ORM\JoinColumn(name="blog_id", referencedColumnName="id", onDelete="SET NULL")
     */
    protected $blog;

    /**
     * @ORM\ManyToOne(targetEntity="Tag")
     * @ORM\JoinColumn(name="tag_id", referencedColumnName="tag", onDelete="SET NULL")
     */
    protected $tag;

}
```

The issue is that if you have an array of Tags you would like to add to a Blog, you would have to create a BlogTags entity for each one. This is not ideal, and is not very efficient. Pivot repositories add functionality to make this easier.


## Creating a Pivot Repository

In the above example, the repository for BlogTags would be the PivotRepository. To do this, implement the PivotRepositoryContact, use the PivotRepository tag and configure the parent and child class:

```php
<?php

namespace App\Modules\Blogs\Tags\Core\Repositories;

use App\Entities\Blog;
use App\Entities\Tags;
use App\Modules\Blogs\Tags\Core\BlogTagContract;
use App\Repositories\Core\CoreRepository;
use BulletDigitalSolutions\Gunshot\Contracts\Repositories\PivotRepositoryContract;
use BulletDigitalSolutions\Gunshot\Traits\Repositories\PivotRepository;

class BlogTagRepository extends CoreRepository implements BlogTagContract, PivotRepositoryContract
{
    use PivotRepository;

    /**
     * @var string
     */
    private $parentClass = Blog::class;

    /**
     * @var string
     */
    private $childClass = Tag::class;
}
```

### Optional Config
If the parent or child class name does not match the property on the entity, you can override the property name:

```php
...
class BlogTags extends BaseEntity
{
    ...
    
    /**
     * @ORM\ManyToOne(targetEntity="Blog")
     * @ORM\JoinColumn(name="blog_id", referencedColumnName="id", onDelete="SET NULL")
     */
    protected $post;

    /**
     * @ORM\ManyToOne(targetEntity="Tag")
     * @ORM\JoinColumn(name="tag_id", referencedColumnName="tag", onDelete="SET NULL")
     */
    protected $tag;

}
```

```php
<?php

...
class BlogTagRepository extends CoreRepository implements BlogTagContract, PivotRepositoryContract
{
    use PivotRepository;

    /**
     * @var string
     */
    private $parentClass = Blog::class;

    /**
     * @var string
     */
    private $childClass = Tag::class;
    
    /**
     * @return string
     */
    public function getParentName()
    {
        return 'post';
    }
}
```

You can also override the following:
 
- getParentName()
- getChildName()
- getParentGetter()
- getParentSetter()
- getChildGetter()
- getChildSetter()

if these are not set, it will assume them by the name of the class.

### PivotAttributes

PivotAttributes are attributes that are added to the pivot table. For example, if you have a pivot table for Blog and Tag, and you want to add a "sort" field, you can do this:

```php
...
class BlogTags extends BaseEntity
{
    ...
    
    /**
     * @ORM\ManyToOne(targetEntity="Blog")
     * @ORM\JoinColumn(name="blog_id", referencedColumnName="id", onDelete="SET NULL")
     */
    protected $post;

    /**
     * @ORM\ManyToOne(targetEntity="Tag")
     * @ORM\JoinColumn(name="tag_id", referencedColumnName="tag", onDelete="SET NULL")
     */
    protected $tag;
    
    /**
     * @ORM\Column(name="sort", type="integer", nullable=false)
     */
    protected $sort = 0;

}
```

```php
...
class BlogTagRepository extends CoreRepository implements BlogTagContract, PivotRepositoryContract
{
    ...
    
    /**
     * @param $pivot
     * @param $attributes
     * @return mixed
     */
    public function savePivotAttributes($pivot, $attributes = [])
    {
        if ($sort = Arr::get($attributes, 'sort')) {
            $pivot->setSort($sort);
        }

        return $pivot;
    }
}
```

When pivots are attached or detached, anything passed as the third parameter will run through your method, and save on your pivot.

## Using the Pivot Repository

The Pivot Repository has the following methods:

### Attach
- Method: `attach`
- Parameters: `$entity1`, `$entity2`, `$pivotAttributes = []`
- Description: This will attach entity1 to entity2. If entity1 is the parent, entity2 must be the child, and vice versa. If the pivot already exists, it will not be created again. If the pivotAttributes are passed, they will be saved on the pivot.
- Returns: This returns an instance of entity1
- Example:
```php
$blog = $this->blogRepository->find(1);
$tag = $this->tagRepository->find(1);

$blog = $this->blogTagRepository->attach($blog, $tag, ['sort' => 1]);
```

### Detach
- Method: `detach`
- Parameters: `$entity1`, `$entity2`
- Description: This will detach entity1 from entity2. If entity1 is the parent, entity2 must be the child, and vice versa. If the pivot does not exist, it will not be deleted.
- Returns: This returns an instance of entity1
- Example:
```php
$blog = $this->blogRepository->find(1);
$tag = $this->tagRepository->find(1);

$blog = $this->blogTagRepository->detach($blog, $tag);
```

### Detach All
- Method: `detachAll`
- Parameters: `$entity`
- Description: This will detach all children from the entity. If the entity is the parent entity, it will detach all children. If the entity is the child entity, it will detach all parents.
- Returns: This returns an instance of entity
- Example:
```php
$blog = $this->blogRepository->find(1);

$blog = $this->blogTagRepository->detachAll($blog);
```

### Sync
- Method: `sync`
- Parameters: `$attachingTo`, `$toAttach = []`, `$pivotAttributes = []`
- Description: This will attach all entities in the toAttach array to the attachingTo entity. If the pivot already exists, it will not be created again. If the pivotAttributes are passed, they will be saved on all the pivots. AttachingTo can either be a child or parent. toAttach can either be an array of entities, or IDs. This will detach already existing entities that are not passed in the toAttach array.
- Returns: This returns an instance of attachingTo
- Example:
```php
$blog = $this->blogRepository->find(1);
$tags = $this->tagRepository->find([1, 2, 3]);

$blog = $this->blogTagRepository->sync($blog, $tags, ['sort' => 1]);
```
```php
$blog = $this->blogRepository->find(1);

$blog = $this->blogTagRepository->sync($blog, [1, 2, 3], ['sort' => 1]);
```

### Sync Without Detaching
- Method: `syncWithoutDetaching`, `syncWithoutDetach`
- Parameters: `$attachingTo`, `$toAttach = []`, `$pivotAttributes = []`
- Description: This will attach all entities in the toAttach array to the attachingTo entity. If the pivot already exists, it will not be created again. If the pivotAttributes are passed, they will be saved on all the pivots. AttachingTo can either be a child or parent. toAttach can either be an array of entities, or IDs. This will not detach any existing entities.
- Returns: This returns an instance of attachingTo
- Example:
```php
$blog = $this->blogRepository->find(1);
$tags = $this->tagRepository->find([1, 2, 3]);

$blog = $this->blogTagRepository->syncWithoutDetaching($blog, $tags, ['sort' => 1]);
```
```php
$blog = $this->blogRepository->find(1);

$blog = $this->blogTagRepository->syncWithoutDetaching($blog, [1, 2, 3], ['sort' => 1]);
```

### Update Existing Pivot
- Method: `updateExistingPivot`
- Parameters: `$entity1`, `$entity2`, `$pivotAttributes = []`
- Description: This will update the pivot between entity1 and entity2. If entity1 is the parent, entity2 must be the child, and vice versa. If the pivot does not exist, it will not be updated.
- Returns: This returns an instance of entity1
- Example:
```php
$blog = $this->blogRepository->find(1);
$tag = $this->tagRepository->find(1);

$blog = $this->blogTagRepository->updateExistingPivot($blog, $tag, ['sort' => 1]);
```

### Find by entities
- Method: `findByEntities`
- Parameters: `$entity1`, `$entity2`, `$pivotSearch`
- Description: This will find the pivot between entity1 and entity2. If entity1 is the parent, entity2 must be the child, and vice versa. If the pivot does not exist, it will return null. If the pivotSearch is passed, it will search the pivot for the key and value.
- Returns: This returns an array of matched pivots
- Example:
```php
$blog = $this->blogRepository->find(1);
$tag = $this->tagRepository->find(1);

$pivot = $this->blogTagRepository->findByEntities($blog, $tag);
```
```php
$blog = $this->blogRepository->find(1);
$tag = $this->tagRepository->find(1);

$pivot = $this->blogTagRepository->findByEntities($blog, $tag, ['sort' => 1]);
```

### Find by entity
- Method: `findByEntity`
- Parameters: `$entity`, `$pivotSearch`
- Description: This will find all pivots that have the entity as either the parent or child. If the pivotSearch is passed, it will search the pivot for the key and value.
- Returns: This returns an array of matched pivots
- Example:
```php
$blog = $this->blogRepository->find(1);

$pivots = $this->blogTagRepository->findByEntity($blog);
```
```php
$blog = $this->blogRepository->find(1);

$pivots = $this->blogTagRepository->findByEntity($blog, ['sort' => 1]);
```

### Is Attached
- Method: `isAttached`
- Parameters: `$entity1`, `$entity2`
- Description: This will check if entity1 is attached to entity2. If entity1 is the parent, entity2 must be the child, and vice versa. If the pivot does not exist, it will return false.
- Returns: This returns a boolean
- Example:
```php
$blog = $this->blogRepository->find(1);
$tag = $this->tagRepository->find(1);

$attached = $this->blogTagRepository->isAttached($blog, $tag);
```

### Get Related
- Method: `getRelated`
- Parameters: `$entity`
- Description: This will get all related entities for the entity.
- Returns: This returns an array of related entities
- Example:
```php
$blog = $this->blogRepository->find(1);

$related = $this->blogTagRepository->getRelated($blog);
```