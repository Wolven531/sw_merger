using UnityEngine;
using System.Collections;
using UnityEngine.SceneManagement;

public class ScreenManager
{
	private static ScreenManager _instance;
	private Monster currentMonster;

	public static ScreenManager Instance { 
		get { 
			if (_instance == null) {
				_instance = new ScreenManager();
			}
			return _instance;
		}
	}


	public void LoadScreen (string ScreenName)
	{
		SceneManager.LoadScene (ScreenName, LoadSceneMode.Single);
	}

	public void LoadNextScreen ()
	{
		Scene ActiveScene = SceneManager.GetActiveScene ();
		int Index = ActiveScene.buildIndex;
		//Debug.LogFormat ("Index {0}, Total - 2:{1}", Index, SceneManager.sceneCountInBuildSettings - 2);
		if (Index == SceneManager.sceneCountInBuildSettings - 2) {
			SceneManager.LoadScene ("VictoryScreen");
		} else {
			//Debug.LogFormat ("Loading Scene:{0}", Index + 1);
			SceneManager.LoadScene (Index + 1);
		}
	}

	public void setCurrentMonster(Monster monster){
		currentMonster = monster;
	}

	public Monster getCurrentMonster(){
		return currentMonster;
	}

	public void GoToMonsterScreen(Monster monster){
		Debug.LogFormat("Going to MonsterInfo for {0}", monster.Name);
		setCurrentMonster(monster);
        LoadScreen("MonsterInfo");
	}
}
