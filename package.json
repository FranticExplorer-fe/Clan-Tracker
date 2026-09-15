import altair as alt
from PIL import Image
import pandas as pd
import streamlit as st

st.set_page_config(
    page_title="Clan War Tracker", page_icon="🛡️", layout="wide"
)

st.markdown(
    """
    <style>
    .stApp {
        background-color: #0b0f19;
        color: white;
    }
    .war-card {
        background-color: #121826;
        border: 1px solid #1e293b;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 16px;
    }
    .stMultiSelect div[data-baseweb="select"] {
        background-color: #121826 !important;
        border-color: #1e293b !important;
    }
    .stMultiSelect span[data-baseweb="tag"] {
        background-color: #121826 !important;
        color: #ffffff !important;
        border: 1px solid #1e293b !important;
    }
    .stTextInput div[data-baseweb="input"] {
        background-color: #121826 !important;
        border-color: #1e293b !important;
    }
    .stSelectbox div[data-baseweb="select"] {
        background-color: #121826 !important;
        border-color: #1e293b !important;
    }
    /* Compact styling for Competitors For Next */
    div[data-testid="column"] div.stSelectbox, 
    div[data-testid="column"] div.stTextInput {
        margin-bottom: -12px !important;
    }
    div[data-testid="column"] div[data-baseweb="select"] > div,
    div[data-testid="column"] div[data-baseweb="input"] > div {
        min-height: 28px !important;
        padding-top: 0px !important;
        padding-bottom: 0px !important;
    }
    </style>
""",
    unsafe_allow_html=True,
)

st.title("🛡️ Clan War Tracker")

if "selected_battle" not in st.session_state:
  st.session_state.selected_battle = None

if "selected_competitor" not in st.session_state:
  st.session_state.selected_competitor = None

if "main_navigation_section" not in st.session_state:
  st.session_state.main_navigation_section = "Battle History"

if "clan_patterns" not in st.session_state:
  st.session_state.clan_patterns = [
      {
          "id": 0,
          "clan_war_name": "Arcade Legends",
          "war_creator": "Admin Alpha",
          "war_date": "June 15, 2026",
          "points": "8.19b",
          "how_to_get_points": "Complete daily base raids and boss sector waves.",
          "points_functions": "Linear scaling based on damage output.",
          "useful_enchants": "Loot V, Swift Strike III",
          "clan_war_status": "Active / Hard",
          "notes": "",
          "image": None,
      }
  ]


def parse_contribution(val_str):
  val_str = str(val_str).strip().lower()
  if not val_str:
    return 0

  multiplier = 1
  if val_str.endswith("k"):
    multiplier = 1_000
    val_str = val_str[:-1]
  elif val_str.endswith("m"):
    multiplier = 1_000_000
    val_str = val_str[:-1]
  elif val_str.endswith("b"):
    multiplier = 1_000_000_000
    val_str = val_str[:-1]
  elif val_str.endswith("t"):
    multiplier = 1_000_000_000_000
    val_str = val_str[:-1]

  try:
    return int(float(val_str) * multiplier)
  except ValueError:
    return 0


def parse_rank(val_str, max_pool):
  val_str = str(val_str).strip()
  if not val_str:
    return 0
  try:
    r = int(val_str)
    return max(0, min(r, max_pool))
  except ValueError:
    return 0


def create_blank_roster():
  data = []
  for i in range(1, 76):
    data.append({
        "id": i - 1,
        "Competitor": f"Competitor {i}",
        "Status": "Member",
        "Contribution": 0,
        "Rank": 0,
        "Join Date": "",
        "Notes": "",
        "Active": True,
    })
  return data


STANDARD_TIMEZONES = [
    "UTC-12:00",
    "UTC-11:00",
    "UTC-10:00",
    "UTC-09:00",
    "UTC-08:00",
    "UTC-07:00",
    "UTC-06:00",
    "UTC-05:00",
    "UTC-04:00",
    "UTC-03:00",
    "UTC-02:00",
    "UTC-01:00",
    "UTC+00:00 (UTC)",
    "UTC+01:00",
    "UTC+02:00",
    "UTC+03:00",
    "UTC+03:30",
    "UTC+04:00",
    "UTC+04:30",
    "UTC+05:00",
    "UTC+05:30",
    "UTC+05:45",
    "UTC+06:00",
    "UTC+06:30",
    "UTC+07:00",
    "UTC+08:00",
    "UTC+09:00",
    "UTC+09:30",
    "UTC+10:00",
    "UTC+11:00",
    "UTC+12:00",
    "UTC+13:00",
    "UTC+14:00",
]

if "gamepass_options" not in st.session_state:
  st.session_state.gamepass_options = []

if "competitor_profiles" not in st.session_state:
  st.session_state.competitor_profiles = {}

if "battles" not in st.session_state:
  st.session_state.battles = {
      "ArcadeBattle2026": {
          "name": "ArcadeBattle2026",
          "rank": "#28",
          "points": "8.19b",
          "battle_status": "Hard Battle",
          "battle_date": "June 15, 2026",
          "total_pool": 24000,
          "roster": create_blank_roster(),
          "guide": (
              "• **Base Assaults:** Focus high-level targets for maximum point"
              " yields.\n• **Lane Coordination:** Clear designated sectors to"
              " unlock multiplier bonuses."
          ),
          "images": [],
      },
      "RoyalBattle2026": {
          "name": "RoyalBattle2026",
          "rank": "#47",
          "points": "762.98k",
          "battle_status": "Easy Battle",
          "battle_date": "July 1, 2026",
          "total_pool": 10000,
          "roster": create_blank_roster(),
          "guide": (
              "• **Defensive Hold:** Prioritize keeping core shield status"
              " active.\n• **Resource Dumps:** Coordinate contribution waves"
              " during evening rush hours."
          ),
          "images": [],
      },
  }

for b_key in list(st.session_state.battles.keys()):
  b_info = st.session_state.battles[b_key]
  if "name" not in b_info:
    b_info["name"] = b_key
  if "battle_status" not in b_info:
    b_info["battle_status"] = "Normal Battle"
  if "battle_date" not in b_info:
    b_info["battle_date"] = "Today"
  if "total_pool" not in b_info:
    b_info["total_pool"] = 10000
  if "roster" not in b_info:
    b_info["roster"] = create_blank_roster()
  else:
    for idx, slot in enumerate(b_info["roster"]):
      if "id" not in slot:
        slot["id"] = idx
      if "Active" not in slot:
        slot["Active"] = True
      if "Rank" not in slot:
        slot["Rank"] = 0
  if "images" not in b_info:
    b_info["images"] = []

if st.session_state.selected_competitor is not None:
  if st.button("⬅️ Back to Competitors Info"):
    st.session_state.selected_competitor = None
    st.session_state.main_navigation_section = "Competitors Info"
    st.rerun()

  c_name = st.session_state.selected_competitor
  if c_name not in st.session_state.competitor_profiles:
    st.session_state.competitor_profiles[c_name] = {
        "discord": "",
        "class_role": "Member",
        "timezone": "UTC+00:00 (UTC)",
        "is_active_status": True,
        "notes": "",
        "gamepasses": [],
    }

  profile = st.session_state.competitor_profiles[c_name]

  st.markdown(f"## 👤 Competitor Profile: {c_name}")
  st.markdown("---")

  with st.container():
    st.markdown('<div class="war-card">', unsafe_allow_html=True)
    p_col1, p_col2 = st.columns(2, gap="large")

    with p_col1:
      profile["discord"] = st.text_input(
          "Discord Handle", value=profile.get("discord", "")
      )
      roles_options = ["Member", "Officer", "Owner", "Recruiter"]
      current_role = profile.get("class_role", "Member")
      if current_role not in roles_options:
        current_role = "Member"
      profile["class_role"] = st.selectbox(
          "Primary Class / Role",
          options=roles_options,
          index=roles_options.index(current_role),
      )

      current_tz = profile.get("timezone", "UTC+00:00 (UTC)")
      if current_tz not in STANDARD_TIMEZONES:
        current_tz = "UTC+00:00 (UTC)"
      profile["timezone"] = st.selectbox(
          "Timezone",
          options=STANDARD_TIMEZONES,
          index=STANDARD_TIMEZONES.index(current_tz),
      )

      st.markdown("#### Member Status")
      current_status_val = profile.get("is_active_status", True)
      status_choice = st.radio(
          "Member Status",
          options=["Active", "Inactive"],
          index=0 if current_status_val else 1,
          horizontal=True,
          label_visibility="collapsed",
      )
      profile["is_active_status"] = status_choice == "Active"

    with p_col2:
      st.markdown("#### Gamepasses")
      current_gps = profile.get("gamepasses", [])
      if not isinstance(current_gps, list):
        current_gps = [current_gps] if current_gps else []

      valid_default_gps = [
          gp for gp in current_gps if gp in st.session_state.gamepass_options
      ]

      profile["gamepasses"] = st.multiselect(
          "Select Gamepasses",
          options=st.session_state.gamepass_options,
          default=valid_default_gps,
          placeholder="Choose options...",
          label_visibility="collapsed",
      )

      st.markdown("#### Add Custom Gamepass")
      new_gp_input = st.text_input(
          "New Gamepass Name",
          placeholder="Type new gamepass name...",
          label_visibility="collapsed",
      )
      if st.button("Add to Options"):
        clean_gp = new_gp_input.strip()
        if clean_gp:
          if clean_gp not in st.session_state.gamepass_options:
            st.session_state.gamepass_options.append(clean_gp)
          if clean_gp not in profile["gamepasses"]:
            profile["gamepasses"].append(clean_gp)
          st.success(f"Added '{clean_gp}' successfully!")
          st.rerun()

    st.markdown("#### Private Officer Notes")
    profile["notes"] = st.text_area(
        "Notes",
        value=profile.get("notes", ""),
        label_visibility="collapsed",
        height=100,
    )
    st.markdown("</div>", unsafe_allow_html=True)

elif st.session_state.selected_battle is None:
  main_nav = st.radio(
      "Navigation Section",
      [
          "Battle History",
          "Competitors Info",
          "Clan Patterns",
          "Competitors For Next",
      ],
      horizontal=True,
      key="main_navigation_section",
  )
  st.markdown("---")

  if main_nav == "Clan Patterns":
    st.subheader("📊 Clan Patterns (Past Clan Wars Analysis)")

    if st.button("➕ Add New Clan Pattern Card"):
      new_id = (
          max([p["id"] for p in st.session_state.clan_patterns], default=-1) + 1
      )
      st.session_state.clan_patterns.append({
          "id": new_id,
          "clan_war_name": "",
          "war_creator": "",
          "war_date": "",
          "points": "",
          "how_to_get_points": "",
          "points_functions": "",
          "useful_enchants": "",
          "clan_war_status": "",
          "notes": "",
          "image": None,
      })
      st.rerun()

    st.markdown("---")

    for pattern in st.session_state.clan_patterns:
      pid = pattern["id"]
      st.markdown('<div class="war-card">', unsafe_allow_html=True)

      p_col_left, p_col_right = st.columns([1.2, 1], gap="large")

      with p_col_left:
        r1_c1, r1_c2 = st.columns(2)
        with r1_c1:
          pattern["clan_war_name"] = st.text_input(
              "Clan War Name",
              value=pattern.get("clan_war_name", ""),
              key=f"pattern_name_{pid}",
          )
        with r1_c2:
          pattern["war_creator"] = st.text_input(
              "War Creator",
              value=pattern.get("war_creator", ""),
              key=f"pattern_creator_{pid}",
          )

        r2_c1, r2_c2 = st.columns(2)
        with r2_c1:
          pattern["war_date"] = st.text_input(
              "War Date",
              value=pattern.get("war_date", ""),
              key=f"pattern_date_{pid}",
          )
        with r2_c2:
          pattern["points"] = st.text_input(
              "Points",
              value=pattern.get("points", ""),
              key=f"pattern_points_{pid}",
          )

        r3_c1, r3_c2 = st.columns(2)
        with r3_c1:
          pattern["how_to_get_points"] = st.text_input(
              "🔴 How to get points",
              value=pattern.get("how_to_get_points", ""),
              key=f"pattern_how_{pid}",
          )
        with r3_c2:
          pattern["points_functions"] = st.text_input(
              "🩷 Points functions",
              value=pattern.get("points_functions", ""),
              key=f"pattern_funcs_{pid}",
          )

        r4_c1, r4_c2 = st.columns(2)
        with r4_c1:
          pattern["useful_enchants"] = st.text_input(
              "🟡 Useful enchants",
              value=pattern.get("useful_enchants", ""),
              key=f"pattern_enchants_{pid}",
          )
        with r4_c2:
          pattern["clan_war_status"] = st.text_input(
              "🛡️ Clan War Status",
              value=pattern.get("clan_war_status", ""),
              key=f"pattern_status_{pid}",
          )

        pattern["notes"] = st.text_input(
            "📄 Notes",
            value=pattern.get("notes", ""),
            key=f"pattern_notes_{pid}",
        )

        st.markdown("#### 🔵 Update Graph Image")
        uploaded_pattern_img = st.file_uploader(
            "Upload graph image",
            type=["png", "jpg", "jpeg"],
            key=f"pattern_uploader_{pid}",
            label_visibility="collapsed",
        )
        if uploaded_pattern_img is not None:
          pattern["image"] = Image.open(uploaded_pattern_img)

        if st.button("🗑️ Delete Card", key=f"delete_pattern_{pid}"):
          st.session_state.clan_patterns = [
              p for p in st.session_state.clan_patterns if p["id"] != pid
          ]
          st.rerun()

      with p_col_right:
        st.markdown("#### 🔵 Graph / Image Insertion Area:")
        if pattern.get("image") is not None:
          st.image(
              pattern["image"],
              caption="Graph Analysis Reference",
              use_container_width=True,
          )
        else:
          st.markdown(
              """
                    <div style="background-color: #0e1422; border: 1px dashed #1e293b; border-radius: 8px; padding: 40px 20px; text-align: center; color: #64748b;">
                        No graph image inserted yet. Upload an image above to populate the blue box.
                    </div>
                    """,
              unsafe_allow_html=True,
          )

      st.markdown("</div>", unsafe_allow_html=True)

  elif main_nav == "Competitors Info":
    st.subheader("Competitors Info")

    competitor_stats = {}
    for b_name, b_data in st.session_state.battles.items():
      active_slots = [
          s for s in b_data.get("roster", []) if s.get("Active", True)
      ]
      valid_slots = [
          s for s in active_slots if s.get("Competitor", "").strip() != ""
      ]
      sorted_slots = sorted(
          valid_slots, key=lambda x: int(x.get("Contribution", 0)), reverse=True
      )

      for rank_idx, slot in enumerate(sorted_slots):
        comp_name = slot.get("Competitor", "").strip()
        if comp_name:
          if comp_name not in competitor_stats:
            competitor_stats[comp_name] = {
                "Wars Competed": 0,
                "Placement Points Sum": 0,
                "Roles": set(),
            }
          competitor_stats[comp_name]["Wars Competed"] += 1
          competitor_stats[comp_name]["Placement Points Sum"] += rank_idx + 1
          competitor_stats[comp_name]["Roles"].add(
              slot.get("Status", "Member")
          )

    if competitor_stats:
      filter_cols1, filter_cols2 = st.columns([2, 2])
      with filter_cols1:
        comp_sort_option = st.selectbox(
            "Sort Competitors By",
            [
                "Most Wars Competed",
                "Least Wars Competed",
                "Highest Total Contribution (Lowest Points)",
                "Lowest Total Contribution (Highest Points)",
                "Competitor Name (A-Z)",
            ],
            key="competitor_sorting_dropdown",
        )

      all_tz_options = ["All Timezones"] + STANDARD_TIMEZONES
      with filter_cols2:
        selected_tz_filter = st.selectbox(
            "Filter by UTC Timezone",
            options=all_tz_options,
            key="competitor_tz_filter_dropdown",
        )

      toggle_cols1, toggle_cols2 = st.columns(2)
      with toggle_cols1:
        categorize_tz = st.toggle(
            "Categorize by UTC Timezone",
            key="categorize_tz_toggle",
        )
      with toggle_cols2:
        categorize_active = st.toggle(
            "Categorize by Active Status",
            key="categorize_active_toggle",
        )

      comp_list_df = []
      for c_name, c_data in competitor_stats.items():
        profile_data = st.session_state.competitor_profiles.get(c_name, {})
        c_tz = profile_data.get("timezone", "UTC+00:00 (UTC)")
        c_active_status = profile_data.get("is_active_status", True)

        comp_list_df.append({
            "Competitor": c_name,
            "Wars Competed": c_data["Wars Competed"],
            "Contribution Score": c_data["Placement Points Sum"],
            "Roles": ", ".join(c_data["Roles"]),
            "Timezone": c_tz,
            "IsActive": c_active_status,
        })

      df_comp_summary = pd.DataFrame(comp_list_df)

      if selected_tz_filter != "All Timezones":
        df_comp_summary = df_comp_summary[
            df_comp_summary["Timezone"] == selected_tz_filter
        ]

      if comp_sort_option == "Most Wars Competed":
        df_comp_summary = df_comp_summary.sort_values(
            by=["Wars Competed", "Contribution Score"], ascending=[False, True]
        )
      elif comp_sort_option == "Least Wars Competed":
        df_comp_summary = df_comp_summary.sort_values(
            by=["Wars Competed", "Contribution Score"], ascending=[True, True]
        )
      elif (
          comp_sort_option
          == "Highest Total Contribution (Lowest Points)"
      ):
        df_comp_summary = df_comp_summary.sort_values(
            by=["Contribution Score", "Wars Competed"], ascending=[True, False]
        )
      elif (
          comp_sort_option
          == "Lowest Total Contribution (Highest Points)"
      ):
        df_comp_summary = df_comp_summary.sort_values(
            by=["Contribution Score", "Wars Competed"], ascending=[False, False]
        )
      else:
        df_comp_summary = df_comp_summary.sort_values(
            by="Competitor", ascending=True
        )

      st.markdown("### Click a Competitor to Open Profile")

      if categorize_tz:
        tz_groups = df_comp_summary["Timezone"].unique()
        for tz_val in sorted(tz_groups):
          group_df = df_comp_summary[df_comp_summary["Timezone"] == tz_val]
          with st.expander(f"🕒 {tz_val} ({len(group_df)} competitors)", expanded=True):
            for _, row in group_df.iterrows():
              status_badge = "🟢 Active" if row["IsActive"] else "🔴 Inactive"
              c_cols = st.columns([3, 1, 1, 2, 2, 1])
              c_cols[0].markdown(f"**{row['Competitor']}** ({status_badge})")
              c_cols[1].markdown(f"Wars: {row['Wars Competed']}")
              c_cols[2].markdown(f"Score: {row['Contribution Score']}")
              c_cols[3].markdown(f"TZ: {row['Timezone']}")
              c_cols[4].markdown(f"Roles: {row['Roles']}")
              if c_cols[5].button("View", key=f"btn_comp_tz_{row['Competitor']}"):
                st.session_state.selected_competitor = row["Competitor"]
                st.rerun()
      elif categorize_active:
        status_groups = [("Active", True), ("Inactive", False)]
        for status_label, status_bool in status_groups:
          group_df = df_comp_summary[df_comp_summary["IsActive"] == status_bool]
          badge_icon = "🟢" if status_bool else "🔴"
          with st.expander(f"{badge_icon} {status_label} ({len(group_df)} competitors)", expanded=True):
            for _, row in group_df.iterrows():
              status_badge = "🟢 Active" if row["IsActive"] else "🔴 Inactive"
              c_cols = st.columns([3, 1, 1, 2, 2, 1])
              c_cols[0].markdown(f"**{row['Competitor']}** ({status_badge})")
              c_cols[1].markdown(f"Wars: {row['Wars Competed']}")
              c_cols[2].markdown(f"Score: {row['Contribution Score']}")
              c_cols[3].markdown(f"TZ: {row['Timezone']}")
              c_cols[4].markdown(f"Roles: {row['Roles']}")
              if c_cols[5].button("View", key=f"btn_comp_act_{row['Competitor']}"):
                st.session_state.selected_competitor = row["Competitor"]
                st.rerun()
      else:
        for _, row in df_comp_summary.iterrows():
          status_badge = "🟢 Active" if row["IsActive"] else "🔴 Inactive"
          c_cols = st.columns([3, 1, 1, 2, 2, 1])
          c_cols[0].markdown(f"**{row['Competitor']}** ({status_badge})")
          c_cols[1].markdown(f"Wars: {row['Wars Competed']}")
          c_cols[2].markdown(f"Score: {row['Contribution Score']}")
          c_cols[3].markdown(f"TZ: {row['Timezone']}")
          c_cols[4].markdown(f"Roles: {row['Roles']}")
          if c_cols[5].button("View", key=f"btn_comp_{row['Competitor']}"):
            st.session_state.selected_competitor = row["Competitor"]
            st.rerun()

      st.caption(
          "ℹ️ **Contribution Score:** Sum of ranks across wars (1st place = 1"
          " point, 2nd place = 2 points, etc.). Lower score means higher"
          " overall contribution rank."
      )
    else:
      st.info("No competitor records found across current rosters.")

  elif main_nav == "Competitors For Next":
    st.subheader("Competitors For Next")
    st.markdown("Select or type competitors for the upcoming war (75 slots total).")

    if "next_roster" not in st.session_state:
      st.session_state.next_roster = [{"id": i, "Competitor": ""} for i in range(75)]

    existing_comps = set()
    for b_name, b_data in st.session_state.battles.items():
      for slot in b_data.get("roster", []):
        c_name = slot.get("Competitor", "").strip()
        if c_name:
          existing_comps.add(c_name)
    existing_comps = sorted(list(existing_comps))

    chunk_size = 15
    num_chunks = 75 // chunk_size

    cols = st.columns(num_chunks, gap="small")

    for chunk_idx in range(num_chunks):
      start_idx = chunk_idx * chunk_size
      end_idx = start_idx + chunk_size

      with cols[chunk_idx]:
        st.markdown(f"**Slots {start_idx + 1}-{end_idx}**")
        st.markdown("---")

        for i in range(start_idx, end_idx):
          slot = st.session_state.next_roster[i]
          uid = slot["id"]

          st.markdown(f"#{i+1}")
          current_val = slot.get("Competitor", "")

          # Using accept_new_options=True to allow selecting or directly typing new names
          chosen_option = st.selectbox(
              f"Select Competitor {uid}",
              options=existing_comps,
              index=existing_comps.index(current_val) if current_val in existing_comps else None,
              placeholder="Select or type...",
              accept_new_options=True,
              key=f"next_sel_{uid}",
              label_visibility="collapsed"
          )

          slot["Competitor"] = chosen_option if chosen_option else ""

  else:
    st.subheader("Battle History")

    with st.expander("➕ Add New Clan War"):
      with st.form("add_war_form"):
        new_war_name = st.text_input("War / Battle Name (e.g. SummerClash2026)")
        new_war_rank = st.text_input("Initial Rank (e.g. #12)")
        new_war_points = st.text_input("Initial Total Points (e.g. 500m)")
        new_war_status = st.text_input(
            "Battle Status (e.g. Easy Battle, Hard Battle)"
        )
        new_war_date = st.text_input(
            "Battle Date (e.g. June 15, 2026)", value="June 15, 2026"
        )
        new_war_pool = st.text_input(
            "Total Competitors Pool Overall (e.g. 24000)", value="10000"
        )
        submit_new_war = st.form_submit_button("Create War")

        if submit_new_war:
          clean_name = new_war_name.strip()
          try:
            pool_val = int(new_war_pool.strip())
          except ValueError:
            pool_val = 10000

          if clean_name and clean_name not in st.session_state.battles:
            st.session_state.battles[clean_name] = {
                "name": clean_name,
                "rank": new_war_rank if new_war_rank else "#1",
                "points": new_war_points if new_war_points else "0",
                "battle_status": (
                    new_war_status if new_war_status else "Normal Battle"
                ),
                "battle_date": new_war_date if new_war_date else "",
                "total_pool": pool_val,
                "roster": create_blank_roster(),
                "guide": "• **Strategy:** Add your point guidelines here.",
                "images": [],
            }
            st.success(f"Successfully created '{clean_name}'!")
            st.rerun()
          elif clean_name in st.session_state.battles:
            st.error("A battle with this name already exists.")
          else:
            st.error("Please enter a valid war name.")

    with st.expander("🗑️ Delete Clan War"):
      if st.session_state.battles:
        war_to_delete = st.selectbox(
            "Select War to Delete",
            options=list(st.session_state.battles.keys()),
            key="delete_war_selectbox"
        )
        if st.button("Permanently Delete Selected War", type="primary"):
          if war_to_delete in st.session_state.battles:
            del st.session_state.battles[war_to_delete]
            st.success(f"Successfully deleted '{war_to_delete}'!")
            st.rerun()
      else:
        st.info("No clan wars available to delete.")

    cols = st.columns(3)
    keys_list = list(st.session_state.battles.keys())
    for idx, b_key in enumerate(keys_list):
      b_info = st.session_state.battles[b_key]
      with cols[idx % 3]:
        with st.container():
          st.markdown(
              f"""
                  <div class="war-card">
                      <h3>{b_info.get('name', b_key)}</h3>
                      <p><b>Status:</b> {b_info.get('battle_status', 'Normal')}</p>
                      <p><b>Date:</b> {b_info.get('battle_date', '')}</p>
                      <p><b>Rank:</b> {b_info['rank']}</p>
                      <p><b>Points:</b> {b_info['points']}</p>
                      <p><b>Total Pool:</b> {b_info.get('total_pool', 10000):,}</p>
                  </div>
                  """,
              unsafe_allow_html=True,
          )
          if st.button("Manage", key=b_key):
            st.session_state.selected_battle = b_key
            st.rerun()
else:
  if st.button("⬅️ Back to Clan Wars"):
    st.session_state.selected_battle = None
    st.rerun()

  b_key = st.session_state.selected_battle
  b_info = st.session_state.battles[b_key]

  chunk_size = 15
  roster = b_info["roster"]
  total_pool = b_info.get("total_pool", 10000)
  max_allowed_points = parse_contribution(b_info["points"])
  num_chunks = max(1, len(roster) // chunk_size)

  control_col1, control_col2 = st.columns([2, 1])

  with control_col1:
    sort_order = st.radio(
        "Sort Contributors By",
        [
            "Highest to Lowest Contribution",
            "Lowest to Highest Contribution",
            "Default Order",
        ],
        key=f"{b_key}_sort_order_radio",
        horizontal=True,
    )

  with control_col2:
    st.markdown("### ")
    is_locked = st.checkbox(
        "🔒 Lock Battle Data & Roster",
        value=False,
        key=f"{b_key}_lock_checkbox",
        help=(
            "Check this to disable editing for name, rank, points, status, date,"
            " pool, guide, enchants, and roster fields."
        ),
    )

  for slot in roster:
    uid = slot["id"]
    comp_key = f"{b_key}_comp_{uid}"
    stat_key = f"{b_key}_stat_{uid}"
    date_key = f"{b_key}_date_{uid}"
    note_key = f"{b_key}_note_{uid}"
    active_key = f"{b_key}_active_{uid}"

    if comp_key in st.session_state:
      slot["Competitor"] = st.session_state[comp_key]
    if stat_key in st.session_state:
      slot["Status"] = st.session_state[stat_key]
    if date_key in st.session_state:
      slot["Join Date"] = st.session_state[date_key]
    if note_key in st.session_state:
      slot["Notes"] = st.session_state[note_key]
    if active_key in st.session_state:
      slot["Active"] = st.session_state[active_key]

  temp_contributions = {}
  for slot in roster:
    uid = slot["id"]
    cont_key = f"{b_key}_cont_{uid}"
    if cont_key in st.session_state:
      temp_contributions[uid] = parse_contribution(st.session_state[cont_key])
    else:
      temp_contributions[uid] = slot.get("Contribution", 0)

  accumulated = 0
  for slot in roster:
    uid = slot["id"]
    cont_key = f"{b_key}_cont_{uid}"
    raw_val = temp_contributions[uid]
    allowed_headroom = max(0, max_allowed_points - accumulated)
    final_val = min(raw_val, allowed_headroom)
    slot["Contribution"] = final_val
    accumulated += final_val
    if cont_key in st.session_state:
      st.session_state[cont_key] = str(final_val)

  for slot in roster:
    uid = slot["id"]
    rank_key = f"{b_key}_rank_{uid}"
    if rank_key in st.session_state:
      slot["Rank"] = parse_rank(st.session_state[rank_key], total_pool)

  edit_col1, edit_col2, edit_col3, edit_col4, edit_col5 = st.columns(5)
  with edit_col1:
    new_battle_name = st.text_input(
        "Clan Battle Name", value=b_info.get("name", b_key), disabled=is_locked
    )
  with edit_col2:
    new_battle_status = st.text_input(
        "Battle Status (e.g. Easy/Hard)",
        value=b_info.get("battle_status", "Normal"),
        disabled=is_locked,
    )
  with edit_col3:
    new_battle_date = st.text_input(
        "Battle Date",
        value=b_info.get("battle_date", ""),
        disabled=is_locked,
    )
  with edit_col4:
    new_rank = st.text_input(
        "Edit War Rank", value=b_info["rank"], disabled=is_locked
    )
  with edit_col5:
    new_points = st.text_input(
        "Edit Total Points", value=b_info["points"], disabled=is_locked
    )

  pool_col1, _ = st.columns([1, 2])
  with pool_col1:
    new_pool_input = st.text_input(
        "Total Competitors Pool Overall",
        value=str(total_pool),
        disabled=is_locked,
    )

  try:
    parsed_pool = int(new_pool_input.strip())
  except ValueError:
    parsed_pool = total_pool

  clean_new_name = new_battle_name.strip() if new_battle_name else b_key

  if not is_locked and (
      clean_new_name != b_key
      or new_battle_status != b_info.get("battle_status", "")
      or new_battle_date != b_info.get("battle_date", "")
      or new_rank != b_info["rank"]
      or new_points != b_info["points"]
      or parsed_pool != total_pool
  ):
    if clean_new_name != b_key:
      if clean_new_name in st.session_state.battles:
        st.error(
            "A battle with this name already exists. Please choose a unique"
            " name."
        )
      else:
        st.session_state.battles[clean_new_name] = st.session_state.battles.pop(
            b_key
        )
        b_key = clean_new_name
        st.session_state.selected_battle = b_key
        b_info = st.session_state.battles[b_key]

    b_info["name"] = clean_new_name
    b_info["battle_status"] = new_battle_status
    b_info["battle_date"] = new_battle_date
    b_info["rank"] = new_rank
    b_info["points"] = new_points
    b_info["total_pool"] = parsed_pool

    new_max_allowed = parse_contribution(new_points)
    acc = 0
    for slot in b_info["roster"]:
      headroom = max(0, new_max_allowed - acc)
      if slot["Contribution"] > headroom:
        slot["Contribution"] = headroom
      acc += slot["Contribution"]

    st.rerun()

  total_assigned_points = sum(s["Contribution"] for s in roster)
  st.info(
      f"📈 **Points Pool Tracker:** Allocated `{total_assigned_points:,}` /"
      f" Max Cap `{max_allowed_points:,}` points across all competitors."
  )

  st.markdown("### 📋 How to Get Points & Strategy Guide")
  updated_guide = st.text_area(
      "Edit Point Strategy Guide",
      value=b_info["guide"],
      key=f"guide_{b_key}",
      height=120,
      disabled=is_locked,
  )
  if not is_locked:
    b_info["guide"] = updated_guide

  st.markdown("### ⚡ Useful Enchants")
  if not is_locked:
    uploaded_files = st.file_uploader(
        "Upload Enchant Screenshots (Select multiple files anytime)",
        type=["png", "jpg", "jpeg"],
        accept_multiple_files=True,
        key=f"uploader_{b_key}",
    )
    if uploaded_files:
      b_info["images"] = [Image.open(f) for f in uploaded_files]

  if b_info["images"]:
    st.markdown("#### Saved Enchant References")
    img_cols = st.columns(min(3, len(b_info["images"])))
    for idx, img in enumerate(b_info["images"]):
      with img_cols[idx % len(img_cols)]:
        st.image(
            img, caption=f"Enchant Reference {idx + 1}", use_container_width=True
        )

  if sort_order == "Highest to Lowest Contribution":
    roster = sorted(
        roster, key=lambda x: int(x.get("Contribution", 0)), reverse=True
    )
  elif sort_order == "Lowest to Highest Contribution":
    roster = sorted(roster, key=lambda x: int(x.get("Contribution", 0)))
  else:
    roster = sorted(roster, key=lambda x: x["id"])

  b_info["roster"] = roster

  edited_df = pd.DataFrame(roster)

  st.markdown("### 📊 Points Analytics by User")
  active_df = edited_df[edited_df["Active"] == True].copy()

  if not active_df.empty and "Contribution" in active_df.columns:
    chart_df = active_df.copy()
    chart_df["Contribution"] = pd.to_numeric(
        chart_df["Contribution"], errors="coerce"
    ).fillna(0)

    chart_col1, chart_col2 = st.columns(2)

    with chart_col1:
      st.markdown("#### Individual Contributions (Bar Chart)")
      bar_data = chart_df.set_index("Competitor")["Contribution"]
      st.bar_chart(bar_data)

    with chart_col2:
      st.markdown("#### Share Distribution (Pie / Donut Chart)")

      pie_df = chart_df.sort_values(by="Contribution", ascending=False).copy()

      total_sum = pie_df["Contribution"].sum()
      if total_sum > 0:
        pie_df["Percentage"] = (
            pie_df["Contribution"] / total_sum
        ) * 100
      else:
        pie_df["Percentage"] = 0.0

      pie_df["Display_Label"] = pie_df.apply(
          lambda row: f"{row['Competitor']} ({row['Percentage']:.1f}%)", axis=1
      )

      pie_chart = (
          alt.Chart(pie_df)
          .mark_arc(innerRadius=60)
          .encode(
              theta=alt.Theta(field="Contribution", type="quantitative"),
              color=alt.Color(
                  field="Display_Label",
                  type="nominal",
                  title="Competitor",
                  sort=alt.EncodingSortField(
                      field="Contribution", op="sum", order="descending"
                  ),
              ),
              tooltip=[
                  alt.Tooltip("Competitor:N", title="Competitor"),
                  alt.Tooltip("Contribution:Q", title="Contribution"),
                  alt.Tooltip("Percentage:Q", format=".1f", title="Percentage (%)"),
              ],
          )
          .properties(height=280)
      )

      st.markdown(
          f'<div style="max-height: 320px; overflow-y: auto; overflow-x: hidden;">',
          unsafe_allow_html=True,
      )
      st.altair_chart(pie_chart, use_container_width=True)
      st.markdown("</div>", unsafe_allow_html=True)
  else:
    st.info(
        "No active competitor contributions found or all slots are marked"
        " inactive."
    )

  st.markdown("---")
  st.markdown("### 👥 Excel-Style Competitors Grid (75 Editable Slots)")

  tab_labels = [
      f"Slots {i * chunk_size + 1}-{(i + 1) * chunk_size}"
      for i in range(num_chunks)
  ]
  tabs = st.tabs(tab_labels)

  for tab_idx, tab in enumerate(tabs):
    with tab:
      h1, h2, h3, h_perf, h4, h5, h6 = st.columns([2, 1, 1, 2.2, 1, 1.5, 0.8])
      h1.markdown("**🔤 Name**")
      h2.markdown("**🛡️ Status**")
      h3.markdown(f"**📈 Points (Max Cap: {b_info['points']})**")
      h_perf.markdown("**🎯 Performance (Rank)**")
      h4.markdown("**📅 Date**")
      h5.markdown("**📝 Notes**")
      h6.markdown("**✅ Active**")
      st.divider()

      start_idx = tab_idx * chunk_size
      end_idx = min(len(roster), start_idx + chunk_size)

      for i in range(start_idx, end_idx):
        slot = roster[i]
        uid = slot["id"]
        c1, c2, c3, c_perf, c4, c5, c6 = st.columns([
            2,
            1,
            1,
            2.2,
            1,
            1.5,
            0.8,
        ])

        with c1:
          slot["Competitor"] = st.text_input(
              f"Name {uid}",
              value=slot["Competitor"],
              key=f"{b_key}_comp_{uid}",
              label_visibility="collapsed",
              disabled=is_locked,
          )
        with c2:
          valid_options = ["Member", "Officer", "Owner", "Recruiter"]
          current_status = (
              slot["Status"] if slot["Status"] in valid_options else "Member"
          )
          slot["Status"] = st.selectbox(
              f"Status {uid}",
              options=valid_options,
              index=valid_options.index(current_status),
              key=f"{b_key}_stat_{uid}",
              label_visibility="collapsed",
              disabled=is_locked,
          )
        with c3:
          contrib_str = st.text_input(
              f"Contrib {uid}",
              value=str(slot["Contribution"]),
              key=f"{b_key}_cont_{uid}",
              placeholder=f"Max {b_info['points']}",
              label_visibility="collapsed",
              disabled=is_locked,
          )

        with c_perf:
          rank_str = st.text_input(
              f"Rank {uid}",
              value=str(slot["Rank"]) if slot["Rank"] > 0 else "",
              key=f"{b_key}_rank_{uid}",
              placeholder=f"Max {total_pool:,}",
              label_visibility="collapsed",
              disabled=is_locked,
          )
          r_val = parse_rank(rank_str, total_pool)
          slot["Rank"] = r_val

          if r_val > 0:
            better = max(0, r_val - 1)
            worse = max(0, total_pool - r_val)
            pct = (r_val / total_pool) * 100
            st.caption(
                f"Better: {better:,} | Worse: {worse:,} (Top {pct:.2f}%)"
            )
          else:
            st.caption(f"Enter rank (Pool: {total_pool:,})")

        with c4:
          slot["Join Date"] = st.text_input(
              f"Date {uid}",
              value=slot["Join Date"],
              key=f"{b_key}_date_{uid}",
              label_visibility="collapsed",
              disabled=is_locked,
          )
        with c5:
          slot["Notes"] = st.text_input(
              f"Notes {uid}",
              value=slot["Notes"],
              key=f"{b_key}_note_{uid}",
              label_visibility="collapsed",
              disabled=is_locked,
          )
        with c6:
          slot["Active"] = st.checkbox(
              f"Active {uid}",
              value=slot["Active"],
              key=f"{b_key}_active_{uid}",
              label_visibility="collapsed",
              disabled=is_locked,
          )

  st.markdown("---")
  st.info(
      """
    📊 **Excel Sheet Column Legend & Controls:**
    * **Competitor Name:** Member identifier or gamertag.
    * **Status:** Clan hierarchy role (Member, Officer, Owner, Recruiter).
    * **Contribution:** Score points contributed toward the war. The cumulative sum across all competitors is automatically checked and clamped so it can never exceed the total clan war points limit. Supports suffixes like `50k`, `2m`, `1.5b`, `1.2t`.
    * **Performance (Rank):** Enter player rank against the total pool to instantly calculate how many players are better/worse and their top percentage.
    * **Join Date:** Date the member joined or registered for this battle.
    * **Notes:** Custom comments, lane assignments, or status tags.
    * **Active (checkbox):** Uncheck to exclude empty or inactive slots from leaderboards and distribution analytics charts.
    """
  )
