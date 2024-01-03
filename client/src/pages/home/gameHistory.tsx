import moment from "moment-timezone"




export function GameHistory(props:any){
    const {my_history}=props

    // console.log("history",history)
    return (<>
            <div className="separatorF"></div>
            <div className="flex justify-between mt-2">
                <div className="ml-5 mr-5">{my_history?.playerOne?.name} vs {my_history?.playerTwo.name}</div>
                <div className="ml-5 mr-5 ">{my_history?.scorePlayerOne <= 0 ? 0:my_history?.scorePlayerOne} : {my_history?.scorePlayerTwo <= 0 ? 0:my_history?.scorePlayerTwo}</div>
                <div className="ml-5 mr-5 ">
                    <span>{moment(my_history.playedOn).tz(moment.tz.guess()).format('HH:mm:ss')}</span>
                    <span className="ml-2">{moment(my_history.playedOn).tz(moment.tz.guess()).format('dd MM/yyyy')}</span>
                </div>
            </div>
    </>)
}
