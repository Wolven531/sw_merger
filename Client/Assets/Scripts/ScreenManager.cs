using UnityEngine;
using System.Collections;
using UnityEngine.SceneManagement;

public class ScreenManager : MonoBehaviour
{
	public static ScreenManager _instance;

	public static ScreenManager Instance { 
		get { 
			if (_instance == null) {
				Debug.Log ("Trying to accesss null reference of Instance.");
			}
			return _instance;
		}
	}

	public void Awake ()
	{
		if (_instance == null) {
			_instance = this;
			GameObject.DontDestroyOnLoad (gameObject);
		} else {
			Destroy (gameObject);
		}
	}
	// Use this for initialization
	void Start ()
	{
		
	}
	
	// Update is called once per frame
	void Update ()
	{
	
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
}
