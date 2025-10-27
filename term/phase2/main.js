"use strict"

let MydailyMood = [
   //2025-9-25
    {
        Date:"2025-9-25",
        SleepTime: "11:00PM",
        WakeUpTime: "10:00AM",
        SleepHours:"11 Hrs",
        SleepQuality:"10", //Sleepquality (1-10) 1=bad 10=best
        EnergyDrink:"0",//6 hrs before bedtime
        mood:{moringMood:5,AftermoonEnergy:4,EveningEnergy:2},//Mood(1-5)1=bad 5=best
        notes: "I have classes at night so feel tired"

    },
   //2025-10-4
    {
        Date:"2025-10-4",
        SleepTime: "1:00AM",
        WakeUpTime: "10:00AM",
        SleepHours:"9 Hrs",
        SleepQuality:"7", //Sleepquality (1-10) 1=bad 10=best
        EnergyDrink:"1",//6 hrs before bedtime
        mood:{moringMood:4,AftermoonEnergy:5,EveningEnergy:5},//Mood(1-5)1=bad 5=best
        notes: "Girlfriend's birthday, go on a date"
    },
    //2025-10-5
    {
        Date:"2025-10-5",
        SleepTime: "12:00AM",
        WakeUpTime: "10:00AM",
        SleepHours:"10 Hrs",
        SleepQuality:"10", //Sleepquality (1-10) 1=bad 10=best
        EnergyDrink:"1",//6 hrs before bedtime
        mood:{moringMood:4,AftermoonEnergy:3,EveningEnergy:4},//Mood(1-5)1=bad 5=best
    },
    //2025-10-8
    {
        Date:"2025-10-8",
        SleepTime: "11:00PM",
        WakeUpTime: "10:00AM",
        SleepHours:"11 Hrs",
        SleepQuality:"9", //Sleepquality (1-10) 1=bad 10=best
        EnergyDrink:"3",//6 hrs before bedtime
        mood:{moringMood:4,AftermoonEnergy:5,EveningEnergy:5},//Mood(1-5)1=bad 5=best
        notes: "I went to the gym before going to bed"
    },
    //2025-10-10
    {
        Date:"2025-10-10",
        SleepTime: "10:00PM",
        WakeUpTime: "8:00AM",
        SleepHours:"10 Hrs",
        SleepQuality:"5", //Sleepquality (1-10) 1=bad 10=best
        EnergyDrink:"0",//6 hrs before bedtime
        mood:{moringMood:2,AftermoonEnergy:3,EveningEnergy:2},//Mood(1-5)1=bad 5=best
        notes: "I slept in a bad position and got a stiff neck"
    },
    //2025-10-11
    {
        Date:"2025-10-11",
        SleepTime: "2:00AM",
        WakeUpTime: "8:00AM",
        SleepHours:"6 Hrs",
        SleepQuality:"3", //Sleepquality (1-10) 1=bad 10=best
        EnergyDrink:"1",//6 hrs before bedtime
        mood:{moringMood:2,AftermoonEnergy:2,EveningEnergy:2},//Mood(1-5)1=bad 5=best
        notes: "My neck hasn't recovered yet."
    },
    //1025-10-13
    {
        Date:"2025-10-13",
        SleepTime: "11:00PM",
        WakeUpTime: "9:00AM",
        SleepHours:"10 Hrs",
        SleepQuality:"9", //Sleepquality (1-10) 1=bad 10=best
        EnergyDrink:"0",//6 hrs before bedtime
        mood:{moringMood:4,AftermoonEnergy:3,EveningEnergy:4},//Mood(1-5)1=bad 5=best
    },
    //2025-10-15
    {
        Date:"2025-10-15",
        SleepTime: "12:00AM",
        WakeUpTime: "10:00AM",
        SleepHours:"10 Hrs",
        SleepQuality:"9", //Sleepquality (1-10) 1=bad 10=best
        EnergyDrink:"2",//6 hrs before bedtime
        mood:{moringMood:5,AftermoonEnergy:4,EveningEnergy:4},//Mood(1-5)1=bad 5=best
        notes:"I went to the gym before going to bed"
    },
    //2025-10-16
    {
        Date:"2025-10-16",
        SleepTime: "11:00PM",
        WakeUpTime: "9:00AM",
        SleepHours:"10 Hrs",
        SleepQuality:"10", //Sleepquality (1-10) 1=bad 10=best
        EnergyDrink:"0",//6 hrs before bedtime
        mood:{moringMood:5,AftermoonEnergy:5,EveningEnergy:3},//Mood(1-5)1=bad 5=best
    },
    //2025-10-18
    {
        Date:"2025-10-18",
        SleepTime: "2:00AM",
        WakeUpTime: "12:00PM",
        SleepHours:"12 Hrs",
        SleepQuality:"5", //Sleepquality (1-10) 1=bad 10=best
        EnergyDrink:"1",//6 hrs before bedtime
        mood:{moringMood:2,AftermoonEnergy:3,EveningEnergy:3},//Mood(1-5)1=bad 5=best
        notes:"Go to the party and drunk"
    },
    //2025-10-20
    {
        Date:"2025-10-20",
        SleepTime: "11:00PM",
        WakeUpTime: "10:00AM",
        SleepHours:"10 Hrs",
        SleepQuality:"9", //Sleepquality (1-10) 1=bad 10=best
        EnergyDrink:"0",//6 hrs before bedtime
        mood:{moringMood:4,AftermoonEnergy:3,EveningEnergy:3},//Mood(1-5)1=bad 5=best
    },
    //2025-10-22
    {
        Date:"2025-10-22",
        SleepTime: "10:00PM",
        WakeUpTime: "10:00AM",
        SleepHours:"10 Hrs",
        SleepQuality:"5", //Sleepquality (1-10) 1=bad 10=best
        EnergyDrink:"1",//6 hrs before bedtime
        mood:{moringMood:3,AftermoonEnergy:2,EveningEnergy:3},//Mood(1-5)1=bad 5=best
        notes:"Woke up at 2:00 AM and fell asleep again at 3:00 AM; felt anxious about homework grades."
    },
    //2025-10-23
    {
        Date:"2025-10-23",
        SleepTime: "1:00AM",
        WakeUpTime: "7:00AM",
        SleepHours:"7 Hrs",
        SleepQuality:"5", //Sleepquality (1-10) 1=bad 10=best
        EnergyDrink:"2",//6 hrs before bedtime
        mood:{moringMood:2,AftermoonEnergy:2,EveningEnergy:2},//Mood(1-5)1=bad 5=best
    },
    //2025-10-24
    {   
        Date:"2025-10-24",
        SleepTime: "12:00AM",
        WakeUpTime: "12:00PM",
        SleepHours:"12 Hrs",
        SleepQuality:"10", //Sleepquality (1-10) 1=bad 10=best
        EnergyDrink:"0",//6 hrs before bedtime
        mood:{moringMood:5,AftermoonEnergy:5,EveningEnergy:5},//Mood(1-5)1=bad 5=best
        },
        //2025-10-26
    {
        Date:"2025-10-26",
        SleepTime: "2:00AM",
        WakeUpTime: "11:00PM",
        SleepHours:"9 Hrs",
        SleepQuality:"6", //Sleepquality (1-10) 1=bad 10=best
        EnergyDrink:"2",//6 hrs before bedtime
        mood:{moringMood:3,AftermoonEnergy:3,EveningEnergy:3},//Mood(1-5)1=bad 5=best
        },

];
showData(MydailyMood);
// console.log(JSON.stringify(yourVariableHere));
// showData(yourVariableHere);