<template>
<div id="main">
    <nav class="navbar navbar-light bg-light">
        <div>
            <a class="navbar-brand">Hi, <b class="text-primary">{{username}}!</b></a>
        </div>
        <div class="btn-group pull-right" role="group" aria-label="Basic example">
          <button
            type="button"
            class="btn btn-secondary"
            @click="resetScoreboard">
            Reset Scoreboard
            </button>
          <button
            type="button"
            class="btn btn-secondary"
            @click="exitApp">
            Exit
            </button>
        </div>
      </nav>
    <div class="row mt-5">
      <div class="col-md-4 text-center">
        <h2>YOU</h2>
        <h3 style="margin: 20px 0 0">Score: {{playerWin}}</h3>
      </div>
            <div class="col-md-4 text-center">
        <h2>TIE</h2>
        <h3 style="margin: 20px 0 0">Score: {{tie}}</h3>
      </div>
      <div class="col-md-4 ml-auto text-center">
        <h2>COMPUTER</h2>
        <h3 style="margin: 20px 0 0">Score: {{compWin}}</h3>

      </div>
    </div>
    <div class="row mt-60">
      <div class="col-md-4 text-center">
        <ul>
          <li v-for="choice in choices" @click="play(choice.id)" v-bind:key="choice.id" :class="{'active': choice.id == activeIndex}">
            <i :class="getIcon(choice.id)"></i> </li>
        </ul>
      </div>
      <div class="col-md-4 align-self-center text-center">
          <h1 class="text-primary">{{message}}</h1>
        <!-- <div class="d-flex align-self-center text-center">
            <h1 class="text-primary">{{message}}</h1>
        </div> -->
      </div>
      <div class="col-md-4 align-self-center text-center">
         <div v-if="loading" class="spinner-grow text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
        <transition name="bounce">
          <div v-if="!loading">
            <i :class="getCompIcon"></i>
          </div>
        </transition>
      </div>
    </div>
    <div class="row justify-content-md-center">
      <div class="col-md-8 text-center">
        <ul class="list-inline">
            <li
                v-for="games in recentGames"
                class="list-inline-item"
                v-bind:key="games.id">
                <span :class="resultBadge(games)">{{getresult(games)}}</span>
            </li>

        </ul>
        <!-- <table class="table table-bordered">
        <thead>
            <tr>
            <th>ID</th>
            <th scope="col">Win</th>
            <th scope="col">Lose</th>
            <th scope="col">Tie</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="game in recentGames" :key="game.id">
                <th scope="row">{{game.id}}</th>
                <td>{{game.win}}</td>
                <td>{{game.lose}}</td>
                <td>{{game.tie}}</td>
            </tr>
        </tbody>
        </table> -->
    </div>

    </div>
        <div class="row justify-content-md-center">
            <div class="col-md-8 text-center">
                <h2>Your last 10 results</h2>
            </div>
        </div>
  </div>
</template>

<script>
    import HTTP from 'src/util/http-common.js';
    export default {
    name: 'Main',
    data() {
        return {
            activeIndex: null,
            activeIndexComp: null,
            message: null,
            playerWin: 0,
            tie: 0,
            compWin: 0,
            choices: [],
            icons: {
                1: 'fas fa-hand-rock fa-7x',
                2: 'fas fa-hand-paper fa-7x',
                3: 'fas fa-hand-scissors fa-7x',
                4: 'fas fa-hand-lizard fa-7x',
                5: 'fas fa-hand-spock fa-7x'
            },
            loading: true,
            compChoice: null,
            recentGames: [],
            username: localStorage.getItem('username')
        }
    },
    computed: {
        getCompIcon() {
            console.log(this.icons[this.compChoice])
            return this.icons[this.compChoice];
        }
    },
    created() {
        this.fetchChoices();
        this.fetchUserStats();
        this.fetchRecentGames();
    },
    methods: {
        play(id) {
            this.loading = true;
            this.activeIndex = id;

            var params = {
                player: id,
            }
            HTTP.post('api/v1/rpsls/play', params)
            .then(response => {
                var data = response.data
                this.compChoice = data.computer

                if (data.results == 'win'){
                    this.playerWin += 1
                } else if (data.results == 'tie') {
                    this.tie += 1
                } else {
                    this.compWin += 1
                }
                this.message = data.message
                this.loading = false;
                this.savePlayResult(data.results);
            }).catch(err => {
                alert(err)
            })  
        },
        fetchChoices() {
            HTTP.get('api/v1/rpsls/choices', {})
            .then(response => {
                this.choices = response.data
            }).catch(err => {
                alert(err)
            })
        },
        getIcon(choice) {
            return "icon-option " + this.icons[choice]
        },
        fetchUserStats() {
            var params = {
                username: this.username
            }
            HTTP.get('api/v1/scoreboard/stats', {params:params})
            .then(response => {
                this.playerWin = response.data.win;
                this.compWin = response.data.lose;
                this.tie = response.data.tie
            }).catch(err => {
                alert(err)
            })
        },
        fetchRecentGames() {
            var params = {
                username: this.username,
                limit: 10
            }
            HTTP.get('api/v1/scoreboard/list', {params:params})
            .then(response => {
                this.recentGames = response.data
            }).catch(err => {
                alert(err)
            })
        },
        exitApp() {
            localStorage.removeItem('username');
            this.$router.push({name: 'Login'})
        },
        resultBadge(games) {
            console.log(games)
            if (games.win === true) {
                return 'badge badge-success'
            } else if (games.lose === true) {
                return 'badge badge-danger'
            } else {
                return 'badge badge-primary'
            }
        },
        getresult(games) {
            if (games.win === true) {
                return 'Win'
            } else if (games.lose === true) {
                return 'Lose'
            } else {
                return 'Tie'
            }
        },
        savePlayResult(result) {
            var params = {
                username: this.username,
                result: result
            }
            HTTP.post('api/v1/scoreboard', params)
            .then(response => {
                console.log(response)
                this.fetchRecentGames();
            }).catch(err => {
                alert(err)
            })  
        },
        resetScoreboard() {
            var params = {
                username: this.username
            }
            HTTP.delete('api/v1/scoreboard/list', {
                data: params
            }).then(response => {
                console.log(response)
                this.fetchRecentGames();
                this.fetchUserStats();
                alert("reset successful");
            }).catch(err => {
                alert(err);
            })
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#main {
    padding-bottom: 10px;
}
h3 {
margin: 40px 0 0;
}
ul {
list-style-type: none;
padding: 0;
}

a {
color: #42b983;
}

.icon-option:hover {
color: #006400;
}
.active {
color: #006400;
}


/* https://vuejs.org/v2/guide/transitions.html */

.bounce-enter-active {
animation: bounce-in .5s;
}
.bounce-leave-active {
animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
0% {
    transform: scale(0);
}
50% {
    transform: scale(1.5);
}
100% {
    transform: scale(1);
}
}
</style>
