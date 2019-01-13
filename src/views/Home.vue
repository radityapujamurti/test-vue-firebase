<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      fixed
      app
    >
      <v-list dense>
        <v-list-tile @click="getAssignments()">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Home</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="displayParticularMonth(item.month)" v-for="item in completedMonths">
          <!-- <v-list-tile-action>
            <v-icon>contact_mail</v-icon>
          </v-list-tile-action> -->
          <v-list-tile-content>
            <v-list-tile-title>{{item.month}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="teal" dark fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Lapor</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat @click=logout()>
        Logout
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container fluid class="grid-list-lg">
        <h3 class="text-xs-left" v-text="pageTitle"></h3>
        <v-layout row wrap>            
              <v-flex xs12 lg4 v-for="assignment in assignments">
                <v-card raised class="assignment-item text-xs-left" v-bind:class="{completed:assignment.completed,incomplete:assignment.incomplete} ">
                  <v-card-title primary-title>
                    <div>
                      <div class="headline">{{assignment.title}}</div>
                      <span>{{assignment.owner}}</span><br>
                      <span v-show="assignment.completed">Completed at: {{assignment.completedDate}}</span>
                    </div>
                  </v-card-title>
                  <v-card-actions v-show="authUser.uid=='5XfgyUGRWoWr1DTTxCk1gBwfaR13'">
                    <v-btn fab dark small color="teal">
                      <v-icon dark>edit</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <!-- <v-footer color="teal" app>
      <span class="white--text">&copy; 2018</span>
    </v-footer> -->
  </v-app>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';
import firebase from 'firebase';
const moment = require('moment');

export default {
  data(){
    return {
      drawer: null,
      assignment:null,
      assignments:[],
      completedMonths:[],
      showCompleted: false,
      pageTitle: "",
      authUser:{},
      currentMonth: ""
    }
  },
  methods:{
    getAssignments(){
      db.collection('assignments').get().then((querySnaphsot) => {
        let allAssignments=[];
        querySnaphsot.forEach(element => {
          // element.pending = true;
          allAssignments.push(element.data())
        })
        this.assignments=allAssignments;
      })
      db.collection('completed').get().then((querySnaphsot) => {
        let completedMonths=[];
        querySnaphsot.forEach(element => {
          completedMonths.push(element.data())
        })
        this.completedMonths=completedMonths;
      })
      this.pageTitle="Assignment List" 
      
      // var currMonth=moment().format('MMMM YYYY');
      // let result=[];
      // allAssignments.forEach(assignment => {
      //   completedMonths.forEach(item => {
      //     if(currMonth == item.month){
      //       assignment.completed = true;
      //       assignment.completedDate = completedAssignmentDate + ' ' + month;
      //     } else {
      //       assignment.pending = true;
      //     }
      //     result.push(assignment);
      //   })
      //   this.showCompleted=true;
      // })
      // this.assignments=result;


    },
    displayParticularMonth(month){
      this.completedMonths.forEach(item => {
        
        if(month == item.month){
            let thisMonthAssignments=[];        
            this.assignments.forEach(assignment => {
              assignment.completed = false;
              item.completed_list.forEach(element => {
                element = element.split(',');
                var completedAssignmentID = element[0];
                var completedAssignmentDate = element[1];
                if(assignment.id == completedAssignmentID){
                  assignment.completed = true;
                  assignment.completedDate = completedAssignmentDate + ' ' + month;
                } else {
                  assignment.incomplete = true;
                }
              })
              thisMonthAssignments.push(assignment);
          })
          this.assignments=thisMonthAssignments;
          this.showCompleted=true;
          
        } else {
          let thisMonthAssignments=[];
          this.assignments.forEach(assignment => {
            assignment.pending = true;
            thisMonthAssignments.push(assignment);
          })
          this.assignments=thisMonthAssignments;
        }
      this.pageTitle=month  
        
      })
    },
    logout(){
      firebase.auth().signOut().then(function() {
        // Sign-out successful.
      }).catch(function(error) {
        // An error happened.
      });
    }
  },
  created(){
    firebase.auth().onAuthStateChanged(user => {
      if(user){
        this.authUser=user;
      } 
      else{
        this.authUser={};
      }
    })
    var currMonth=moment().format('MMMM YYYY');
    this.displayParticularMonth(currMonth);
    
  },
  mounted(){
    this.getAssignments();
    
  },
  beforeRouteEnter(to,from,next){
    next(vm => {
      firebase.auth().onAuthStateChanged(user => {
        if(user){
          next();
        } 
        else {
          vm.$router.push('/login')
        }
      })
    })
  }
}
</script>


<style scoped="">


.assignment-item.incomplete{
    border-right: maroon solid 2vw !important;
}
.assignment-item.completed{
    border-right: teal solid 2vw !important;
}


</style>
