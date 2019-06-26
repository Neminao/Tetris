import React from 'react'

function Highscore(props: any) {

    let scores: any[] = [];

    for (let i = 0; i < 10; i++) {
        if (props.scores[i])
            scores.push(<tr>
                <td>{i+1}.</td>
                <td>{props.scores[i].name}</td>
                <td>{props.scores[i].score}</td>
                <td>{props.scores[i].rows}</td>
            </tr>)

    }
    return (
        <div className="highscore">
        Highscores - {props.title}
        <table>
            <tbody>
                
                <tr>
                    <td> </td>
                    <td>Name</td>
                    <td>Score</td>
                    <td>Lines</td>
                </tr>
                {scores}
            </tbody>
        </table>-----------</div>
    )
}

export default Highscore