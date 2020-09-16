#!/usr/bin/env groovy
pipeline{
    agent { node {label 'jobs_all'}} //you can specify agent as any like "agent any"

    //environment variables - defined in this block outside of stage is 
    //accessible to all stages - global
    environment{
        BUILD_NUMBER = "1.0.0" //Jenkins provided variable example
        user = 'User'
    }

    //parameterization
    parameters{
        choice(
            choices : ['npm', 'maven'],
            description: 'to do npm install only when a condition is met',
            name: 'REQUESTED_ACTION'
        )
    }
    
    //trigger the build once manually for below cron to take effect
    triggers{
        //triggers to pollSCM every 5 mins on 2nd half of every hour 
        //below line commented on purpose not to trigger 
        
        //cron('H(30-59)/5 * * * *')

        //below cron triggers every 3 hrs between 9am and 5pm on weekdays only
        cron('H H(9-16)/3 * * 1-5')
    }

    //time out the whole pipeline if it is more than 1 mins
    options{
        timeout(time: 15, unit: 'MINUTES') //unit can be seconds, hours etc. default mins
    }
    stages{
        stage('Git checkout'){
            steps{
                echo 'Checkout code from github repo'
                echo "user defined env var is ${user}"
                git branch: 'master', url: 'https://github.com/mailtwogopal/nodejs-api.git'
            }
        }
        stage('Install Dependencies'){
            when{
                //one expression is required inside when
                expression {params.REQUESTED_ACTION == 'npm' }
            } //when ends here
                    steps{
                        echo "Build number is ${BUILD_NUMBER}"
                        echo 'Installing dependencies'
                        sh "npm install"
            }
            
        }
        stage('Build'){
            steps{
                parallel(  //parallel tasks within steps
                    "taskone" : {
                        script{
                            def buildnumber = 1
                            echo "Build number hardcoded is : ${buildnumber}"                          
                        }
                    },
                    "tasktwo" : {
                        script{
                            try{
                                retry(3){ //retrying this step for 3 times
                                    echo "within retry"
                                    sh "npm run build"
                                }
                            }
                            catch(err){
                                currentBuild.result = "FAILURE"
                                echo "Error caught is : ${err}"
                            }  
                        }                                 
                    }
                )
            }
        }
    }//end of stages
    post{
        always{
            echo 'This will run irrespective of build status'
        }
        success{
            echo 'This msg will show only when build is successful'
        }
        failure{
            echo 'This will show when build is failed'
        }
        unstable{
            echo 'unstable state due to code violation, other causes'
        }
        changed{
            echo 'This will run when current pipeline running at diff state from previous pipeline'
        }
    }
}