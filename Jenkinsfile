#!/usr/bin/env groovy
pipeline{
    agent { node {label 'jobs_all'}} //you can specify agent as any like agent any

    //triggers to pollSCM every 5 mins
    triggers{
        cron('H(30-59)/5 * * * *')
    }

    //time out the whole pipeline if it is more than 1 mins
    options{
        timeout(time: 15, unit: 'MINUTES') //unit can be seconds, hours etc. default mins
    }
    stages{
        stage('Git checkout'){
            steps{
                echo 'Checkout code from github repo'
                git branch: 'master', url: 'https://github.com/mailtwogopal/nodejs-api.git'
            }
        }
        stage('Install Dependencies'){
            steps{
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
    }
}