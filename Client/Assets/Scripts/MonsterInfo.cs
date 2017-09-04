using System;
using System.Collections;
using System.Collections.Generic;
using awillInc;
using UnityEngine;
using UnityEngine.UI;

public class MonsterInfo : MonoBehaviour {

	public ImgDisp IMG_PREFAB;

    public Transform Name;
    public Transform Type;
    public Transform StarLevel;
    [SerializeField] ImgDisp ImageBase;
    [SerializeField] ImgDisp ImageAwakened;
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
		ResizeScrollArea();
	}

    private void ResizeScrollArea()
    {
		Transform scrollview = this.gameObject.transform.Find("Scroll View");
        Transform viewport = scrollview.Find("Viewport");
		RectTransform viewportRect = viewport.GetComponent<RectTransform>();
		//height of viewport?   viewportRect.sizeDelta.y
		RectTransform canvasRect = this.GetComponent<RectTransform>();
		Debug.LogFormat("CanvasRect Y:{0}", canvasRect.sizeDelta.y);
		viewportRect.sizeDelta = new Vector2(viewportRect.sizeDelta.x ,canvasRect.sizeDelta.y);
    }

    private void PopulateData(Monster monster){
		Transform nameText = Name.Find("Text");
		nameText.GetComponent<Text>().text = monster.Name;

		Transform typeText = Type.Find("Text");
		typeText.GetComponent<Text>().text = monster.type;

		//NOTE: Redo with stars
		Transform starLevel = StarLevel.Find("Text");
		starLevel.GetComponent<Text>().text = string.Format("{0}*'s", monster.star_level);

		ImgDisp.loadSpriteToObject(
            monster.image_base,
            ImageBase,
            string.Format(
                "{0}_{1}_b.png",
                monster.type,
                monster.Name
            )
        );

        ImgDisp.loadSpriteToObject(
            monster.image_awakened,
            ImageAwakened,
            string.Format(
                "{0}_{1}_a.png",
                monster.type,
                monster.Name
            )
        );

		Transform levelText = Level.Find("Value");
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

	private void Back(){
		ScreenManager.Instance.LoadScreen("Main");
	}
}

