import { Link, useParams } from "react-router-dom"
import useAxios from "../hooks/useAxios"
import ActionsPlayers from "../components/ActionsPlayers"

const StatusGame = () => {

    const {game} = useParams()
    const {data, isLoading, error, setData} = useAxios("http://localhost:8000/api/player")

    const successActionChange = (player, indexGame, action) => {
        const index = data.indexOf(player)
        const playerCopy = {...player, games: [...player.games]}
        playerCopy.games[indexGame] = action
        const newData = [...data]
        newData[index] = playerCopy
        setData(newData)
    }


    if(error){
        return <div>{error.message}</div>
    }

    if(isLoading){
        return <div>Loading...</div>
    }

    return (
        <div>
            <h1>Player Status Game {game}</h1>

            <Link to="/players/status/1" className="me-3">Game 1</Link>
            <Link to="/players/status/2" className="me-3">Game 2</Link>
            <Link to="/players/status/3" className="me-3">Game 3</Link>

            <div>
                <table className="mt-4 table table-striped table-hover table-bordered">
                    <thead> 
                        <tr>
                            <th>Team Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((player) => (
                            <tr key={player._id}>
                                <td>{player.name}</td>
                                <td><ActionsPlayers player={player} game={game} successCallback={successActionChange}/></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default StatusGame