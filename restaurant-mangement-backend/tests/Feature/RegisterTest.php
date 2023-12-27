<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegisterTest extends TestCase
{
    use RefreshDatabase;

    public function test_register_validation()
    {
        $this->postJson('/api/register')
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'password']);
    }

    public function test_user_can_register()
    {
        $this->postJson('/api/register', [
            'name' => 'test',
            'email' => 'test@test.com',
            'password' => 'password',
            'password_confirmation' => 'password']
        )->assertStatus(200)
            ->assertJson([
                'message' => 'User created successfully'
            ]);

        $this->assertDatabaseHas('users',[
            'email'=>'test@test.com'
        ]);
    }
}
# ./vendor/bin/phpunit --filter RegisterTest
