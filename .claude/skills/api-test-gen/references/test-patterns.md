# Patterns de test par type d'operation

## GET Collection

```php
public function testGetCollection(): void
{
    $this->createAuthenticatedClient()->request('GET', '/api/entities');
    $this->assertResponseIsSuccessful();
    $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
    $this->assertJsonContains(['hydra:totalItems' => $expectedCount]);
}

public function testGetCollectionUnauthenticated(): void
{
    static::createClient()->request('GET', '/api/entities');
    $this->assertResponseStatusCodeSame(401);
}

public function testGetCollectionForbidden(): void
{
    $this->createAuthenticatedClient('ROLE_USER')->request('GET', '/api/entities');
    $this->assertResponseStatusCodeSame(403);
}

public function testGetCollectionFilters(): void
{
    $this->createAuthenticatedClient()->request('GET', '/api/entities?status=active');
    $this->assertResponseIsSuccessful();
    // Verifier que seuls les resultats filtres sont retournes
}
```

## GET Item

```php
public function testGetItem(): void
{
    $entity = $this->findEntity();
    $this->createAuthenticatedClient()->request('GET', '/api/entities/' . $entity->getId());
    $this->assertResponseIsSuccessful();
    $this->assertJsonContains(['@id' => '/api/entities/' . $entity->getId()]);
}

public function testGetItemNotFound(): void
{
    $this->createAuthenticatedClient()->request('GET', '/api/entities/99999');
    $this->assertResponseStatusCodeSame(404);
}

public function testGetItemUnauthorizedOwner(): void
{
    $entity = $this->findEntityOwnedByOtherUser();
    $this->createAuthenticatedClient('other_user')->request('GET', '/api/entities/' . $entity->getId());
    $this->assertResponseStatusCodeSame(403);
}
```

## POST (Creation)

```php
public function testCreateEntity(): void
{
    $this->createAuthenticatedClient()->request('POST', '/api/entities', [
        'json' => [
            'name' => 'Test Entity',
            'description' => 'A valid description',
        ],
    ]);
    $this->assertResponseStatusCodeSame(201);
    $this->assertJsonContains(['name' => 'Test Entity']);
}

public function testCreateEntityValidationError(): void
{
    $this->createAuthenticatedClient()->request('POST', '/api/entities', [
        'json' => [
            'name' => '', // champ requis vide
        ],
    ]);
    $this->assertResponseStatusCodeSame(422);
}

public function testCreateEntityMissingFields(): void
{
    $this->createAuthenticatedClient()->request('POST', '/api/entities', [
        'json' => [],
    ]);
    $this->assertResponseStatusCodeSame(422);
}

/** @dataProvider provideInsufficientRoles */
public function testCreateEntityForbiddenRole(string $role): void
{
    $this->createAuthenticatedClient($role)->request('POST', '/api/entities', [
        'json' => ['name' => 'Test'],
    ]);
    $this->assertResponseStatusCodeSame(403);
}

public static function provideInsufficientRoles(): iterable
{
    yield 'anonymous' => [''];
    yield 'basic user' => ['ROLE_USER'];
}
```

## PATCH (Mise a jour)

```php
public function testUpdateEntity(): void
{
    $entity = $this->findEntity();
    $this->createAuthenticatedClient()->request('PATCH', '/api/entities/' . $entity->getId(), [
        'json' => ['name' => 'Updated Name'],
        'headers' => ['Content-Type' => 'application/merge-patch+json'],
    ]);
    $this->assertResponseIsSuccessful();
    $this->assertJsonContains(['name' => 'Updated Name']);
}

public function testUpdateEntityNotFound(): void
{
    $this->createAuthenticatedClient()->request('PATCH', '/api/entities/99999', [
        'json' => ['name' => 'Updated'],
        'headers' => ['Content-Type' => 'application/merge-patch+json'],
    ]);
    $this->assertResponseStatusCodeSame(404);
}

public function testUpdateEntityValidationError(): void
{
    $entity = $this->findEntity();
    $this->createAuthenticatedClient()->request('PATCH', '/api/entities/' . $entity->getId(), [
        'json' => ['name' => ''],
        'headers' => ['Content-Type' => 'application/merge-patch+json'],
    ]);
    $this->assertResponseStatusCodeSame(422);
}
```

## DELETE

```php
public function testDeleteEntity(): void
{
    $entity = $this->findEntity();
    $this->createAuthenticatedClient()->request('DELETE', '/api/entities/' . $entity->getId());
    $this->assertResponseStatusCodeSame(204);
}

public function testDeleteEntityNotFound(): void
{
    $this->createAuthenticatedClient()->request('DELETE', '/api/entities/99999');
    $this->assertResponseStatusCodeSame(404);
}

public function testDeleteEntityForbidden(): void
{
    $entity = $this->findEntityOwnedByOtherUser();
    $this->createAuthenticatedClient('basic_user')->request('DELETE', '/api/entities/' . $entity->getId());
    $this->assertResponseStatusCodeSame(403);
}
```

## Helpers recommandes

```php
private function createAuthenticatedClient(string $role = 'ROLE_ADMIN'): HttpClientInterface
{
    // Creer un client authentifie avec le role specifie
}

private function findEntity(): Entity
{
    return static::getContainer()->get('doctrine')
        ->getRepository(Entity::class)
        ->findOneBy([]);
}

private function loadFixtures(): void
{
    // Charger les fixtures necessaires pour les tests
}
```
