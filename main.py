import pygame, sys, random
from pygame.locals import QUIT, KEYDOWN, K_SPACE, K_LEFT, K_RIGHT, K_UP, K_DOWN

    # Initialize Pygame
pygame.init()

    # Set up the display
DISPLAYSURF = pygame.display.set_mode((800, 600))
pygame.display.set_caption('Feliz cumpleaños, Raymond')

    # Load images
background = pygame.image.load('background.jpg')
character_img = pygame.image.load('character.png')
character_img = pygame.transform.scale(character_img, (150, 150))
enemy_img = pygame.image.load('enemy.png')
enemy_img = pygame.transform.scale(enemy_img, (enemy_img.get_width() // 4, enemy_img.get_height() // 4))
ball_img = pygame.image.load('ball.png')
ball_img = pygame.transform.scale(ball_img, (30, 30))
collision_img = pygame.image.load('collision.png')
collision_img = pygame.transform.scale(collision_img, (collision_img.get_width() // 4, collision_img.get_height() // 4))

    # Define colors
WHITE = (255, 255, 255)

    # Define classes
class Character:
        def __init__(self):
            self.image = character_img
            self.rect = self.image.get_rect()
            self.rect.topleft = (600, 300)
            self.speed = 5

        def move(self, dx, dy):
            self.rect.x += dx
            self.rect.y += dy
            self.rect.x = max(0, min(self.rect.x, 800 - self.rect.width))
            self.rect.y = max(0, min(self.rect.y, 600 - self.rect.height))

        def draw(self):
            DISPLAYSURF.blit(self.image, self.rect.topleft)

class Ball:
        def __init__(self, x, y):
            self.image = ball_img
            self.rect = self.image.get_rect()
            self.rect.topleft = (x, y)
            self.speed = 10

        def move(self):
            self.rect.x -= self.speed

        def draw(self):
            DISPLAYSURF.blit(self.image, self.rect.topleft)

class Enemy:
        def __init__(self):
            self.image = enemy_img
            self.rect = self.image.get_rect()
            self.rect.topleft = (0, random.randint(0, 550))
            self.speed = 1

        def move(self):
            self.rect.x += self.speed

        def draw(self):
            DISPLAYSURF.blit(self.image, self.rect.topleft)

    # Initialize game objects
character = Character()
balls = []
enemies = []
score = 0
collision_image = None

    # Main game loop
while True:
        for event in pygame.event.get():
            if event.type == QUIT:
                pygame.quit()
                sys.exit()
            if event.type == KEYDOWN:
                if event.key == K_SPACE:
                    balls.append(Ball(character.rect.left, character.rect.centery))

        keys = pygame.key.get_pressed()
        if keys[K_LEFT]:
            character.move(-character.speed / 2, 0)  # Half the speed
        if keys[K_RIGHT]:
            character.move(character.speed / 2, 0)  # Half the speed
        if keys[K_UP]:
            character.move(0, -character.speed / 2)  # Half the speed
        if keys[K_DOWN]:
            character.move(0, character.speed / 2)  # Half the speed

        for ball in balls:
            ball.move()
            if ball.rect.right < 0:
                balls.remove(ball)

        if random.randint(1, 20) == 1:
            enemies.append(Enemy())
        for enemy in enemies:
            enemy.move()
            if enemy.rect.left > 800:
                enemies.remove(enemy)

        for ball in balls:
            for enemy in enemies:
                if ball.rect.colliderect(enemy.rect):
                    balls.remove(ball)
                    enemies.remove(enemy)
                    score += 1
                    collision_image = collision_img
                    break

        DISPLAYSURF.blit(background, (0, 0))
        character.draw()
        for ball in balls:
            ball.draw()
        for enemy in enemies:
            enemy.draw()

        if collision_image:
            collision_rect = collision_image.get_rect()
            collision_rect.center = (ball.rect.centerx, ball.rect.centery)
            DISPLAYSURF.blit(collision_image, collision_rect)
            collision_image = None

        font = pygame.font.Font(None, 36)
        score_text = font.render(f'Score: {score}', True, WHITE)
        DISPLAYSURF.blit(score_text, (10, 10))

        # Add the message
        message_text = font.render('Felicidades, Raymond', True, WHITE)
        message_rect = message_text.get_rect()
        message_rect.topright = (700, 10)
        DISPLAYSURF.blit(message_text, message_rect)

        pygame.display.update()