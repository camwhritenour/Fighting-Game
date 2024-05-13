const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: './img/background.png'
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 185,
    },
    imageSrc: './img/shop.png',
    scale: 2.5,
    framesMax: 6
})

const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './img/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 152
    },
    sprites: {
        idle: {
            imageSrc: './img/samuraiMack/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './img/samuraiMack/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/samuraiMack/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/samuraiMack/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './img/samuraiMack/Attack1.png',
            framesMax: 6
        },
    }

})


const enemy = new Fighter({
    position: {
        x: 500,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    }
})

const keys = {
    a: {
        presssed: false
    },
    d: {
        presssed: false
    },


    ArrowLeft: {
        presssed: false
    },
    ArrowRight: {
        presssed: false
    },

}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    player.update()
    // enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    //player movement
    
    if (keys.a.presssed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run')
    } else if (keys.d.presssed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }

    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    //enemy movement
    if (keys.ArrowLeft.presssed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
    } else if (keys.ArrowRight.presssed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
    }

    // detect collision
    if (rectangularCollison({
        rectangle1: player,
        rectangle2: enemy
    }) &&
        player.isAttacking
    ) {
        player.isAttacking = false
        enemy.health -= 20
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }

    if (rectangularCollison({
        rectangle1: enemy,
        rectangle2: player
    }) &&
        enemy.isAttacking
    ) {
        enemy.isAttacking = false
        player.health -= 20
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }

    // end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId })
    }
}

animate()

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        //player controls
        case 'd':
            keys.d.presssed = true
            player.lastKey = 'd'
            break
        case 'a':
            keys.a.presssed = true
            player.lastKey = 'a'
            break
        case 'w':
            player.velocity.y = -20
            break
        case ' ':
            player.attack()
            break

        //enemy controls
        case 'ArrowRight':
            keys.ArrowRight.presssed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.presssed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            enemy.velocity.y = -20
            break
        case 'ArrowDown':
            enemy.attack()
            break
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        //player controls
        case 'd':
            keys.d.presssed = false
            break
        case 'a':
            keys.a.presssed = false
            break

        //enemy controls
        case 'ArrowRight':
            keys.ArrowRight.presssed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.presssed = false
            break
    }

})