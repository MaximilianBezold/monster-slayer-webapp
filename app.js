function calculateRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
    data() {
        return {
            playerHealth: 100,
            monsterHealth: 100,
            currentRound: 0,
            specialAttackTimeout: 1,
            gameOver: false,
            winner: null,
            gameOverCaption: '',
            logMessages: [],
        };
    },

    methods: {
        startNewGame() {
            this.playerHealth = 100;
            this.monsterHealth = 100;
            this.gameOver = false;
            this.currentRound = 0;
            this.specialAttackTimeout = 1;
            this.winner = null;
            this.gameOverCaption = '';
            this.logMessages = [];
        },

        attackMonster() {
            const attackDamage = calculateRandomValue(5, 12);
            this.monsterHealth -= attackDamage;
            this.addLogMessage('player', 'attack', attackDamage);
            this.evaluateCurrentRound();
        },

        attackPlayer() {
            const attackDamage = calculateRandomValue(8, 15);
            this.playerHealth -= attackDamage;
            this.addLogMessage('monster', 'attack', attackDamage);
        },

        executeSpecialAttack() {
            const attackDamage = calculateRandomValue(10, 25);
            this.monsterHealth -= attackDamage;
            this.addLogMessage('player', 'special-attack', attackDamage);
            this.evaluateCurrentRound();
            this.specialAttackTimeout = 3;
        },

        evaluateCurrentRound () {
            this.currentRound++;
            if (this.specialAttackTimeout > 0) {
                this.specialAttackTimeout--;
            }
            this.attackPlayer();
            if (this.playerHealth <= 0 || this.monsterHealth <= 0){
                this.gameOver = true;
            }
        },

        healPlayer() {
            const healValue = calculateRandomValue(8, 20);
            if (this.playerHealth + healValue > 100) {
                this.playerHealth = 100;
            } else {
                this.playerHealth += healValue;
                this.addLogMessage('player', 'heal', healValue);
            }
            this.evaluateCurrentRound();
        },

        surrender() {
            this.gameOver = true;
        },

        addLogMessage(who, what, value) {
            this.logMessages.unshift({
                actionBy: who,
                actionType: what,
                actionValue: value,
            });
        },
        
    },

    computed: {
        monsterBarStyles() {
            if (this.monsterHealth <= 0) {
                return {width: 0};
            }
            return {width: this.monsterHealth + '%'};
        },

        playerBarStyles() {
            if (this.playerHealth <= 0) {
                return {width: 0};
            }
            return {width: this.playerHealth + '%'}
        },

        specialAttackAvailable() {
            return this.specialAttackTimeout === 0;
        },

        playerHealthFull() {
            return this.playerHealth === 100;
        },

        theWinnerIs() {
            if (this.gameOver) { // check if game is over
                if (this.winner === 'draw') {
                    // DRAW
                    this.gameOverCaption = '🎌 It\'s a draw! 🎌';
                    return 'After a ferocious fight, you slayed the monster while taking your very last breath. What an heroic death!';
                } else if (this.winner === 'monster') {
                    // YOU LOST
                    this.gameOverCaption = '💀 You lost! 💀';
                    return 'The last thing you hear is your skull cracking open between the powerful jaws of the beast. You are monster food now.';
                } else if (this.winner === 'player') {
                    // YOU WON
                    this.gameOverCaption = '👑 You won! 👑';
                    return 'What a fight! The beast is done and a new legend is born. All hail the mighty hero!';
                } else {
                    // SURRENDER
                    this.gameOverCaption = '🐰 You surrendered! 🐰';
                    return 'Run, little hero, run!';
                }
            }
        },

        // whoWonTheGame() {
        //     if (this.playerHealth > 0 && this.monsterHealth > 0) {
        //         return 'Run, little hero, run!';
        //     } else if (this.playerHealth <= 0 && this.monsterHealth <= 0) {
        //         return 'After a ferocious fight, you slayed the monster while taking your very last breath. What an heroic death!';
        //     } else if (this.playerHealth > this.monsterHealth) {
        //         return 'What a fight! The beast is done and a new legend is born. All hail the mighty hero!';
        //     } else if (this.playerHealth < this.monsterHealth) {
        //         return 'The last thing you hear is your skull cracking open between the powerful jaws of the beast. You are monster food now.';
        //     }
        // }
    },

    watch: {
        playerHealth(val) {
            if (val <= 0 && this.monsterHealth <= 0) { // a draw
                this.winner = 'draw';
            } else if (val <= 0) { // Player lost
                this.winner = 'monster';
            }
        },

        monsterHealth(val) {
            if (val <= 0 && this.playerHealth <= 0) { // a draw
                this.winner = 'draw';
            } else if (val <= 0) { // Monster lost
                this.winner = 'player';
            }
        },
    },
});

app.mount('#game');