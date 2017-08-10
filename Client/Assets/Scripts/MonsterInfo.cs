using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class MonsterInfo : MonoBehaviour {
    public Transform Name;
    public Transform Type;
    public Transform StarLevel;
    public Transform ImageBase;
    public Transform ImageAwakened;
    public Transform Level;
    public Transform BaseHP;
    public Transform BaseAttack;
    public Transform BaseSpeed;
    public Transform BaseDefense;
    public Transform BaseCritRate;
    public Transform BaseCritDamage;
    public Transform BaseResistance;
    public Transform BaseAccuracy;

	void Start(){
		Monster monster = ScreenManager.Instance.getCurrentMonster();
		PopulateData(monster);
	}
	public void PopulateData(Monster monster){
		Transform nameText = Name.Find("Text");
		nameText.GetComponent<Text>().text = monster.Name;

		Transform typeText = Type.Find("Text");
		typeText.GetComponent<Text>().text = monster.type;

		//NOTE: Star Level
		//NOTE: Image Base
		//NOTE: Image Awakened

		Transform levelText = Level.Find("Text");
		levelText.GetComponent<Text>().text = string.Format("{0}", monster.level);

		Transform baseHPText = BaseHP.Find("Value");
		baseHPText.GetComponent<Text>().text = string.Format("{0}", monster.base_hp);

		Transform baseAttackText = BaseAttack.Find("Value");
		baseAttackText.GetComponent<Text>().text = string.Format("{0}", monster.base_attack);

		Transform baseSpeedText = BaseSpeed.Find("Value");
		baseSpeedText.GetComponent<Text>().text = string.Format("{0}", monster.base_speed);

		Transform baseDefenseText = BaseDefense.Find("Value");
		baseDefenseText.GetComponent<Text>().text = string.Format("{0}", monster.base_defense);

		Transform baseCritRateText = BaseCritRate.Find("Value");
		baseCritRateText.GetComponent<Text>().text = string.Format("{0}", monster.base_crit_rate);

		Transform baseCritDamageText = BaseCritDamage.Find("Value");
		baseCritDamageText.GetComponent<Text>().text = string.Format("{0}", monster.base_crit_damage);

		Transform baseResistanceText = BaseResistance.Find("Value");
		baseResistanceText.GetComponent<Text>().text = string.Format("{0}", monster.base_resistance);

		Transform baseAccuracyText = BaseAccuracy.Find("Value");
		baseAccuracyText.GetComponent<Text>().text = string.Format("{0}", monster.base_accuracy);
	}

	public void Back(){
		ScreenManager.Instance.LoadScreen("Main");
	}
}
