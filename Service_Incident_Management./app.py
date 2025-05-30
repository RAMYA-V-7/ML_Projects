import streamlit as st
import pandas as pd
import plotly.express as px

# Page Config (Wide Layout, Custom Title)
st.set_page_config(page_title="Service Requests & Incidents Dashboard", layout="wide")

# Load dataset with caching for performance
@st.cache_data
def load_data():
    df = pd.read_csv("service_requests_incidents_updated.csv", parse_dates=["Created Date", "Resolved Date"])
    df["Created Month"] = df["Created Date"].dt.to_period("M").astype(str)
    df["Created Day"] = df["Created Date"].dt.day_name()
    return df

df = load_data()

# Sidebar Filters
st.sidebar.header("Filter Data")
category = st.sidebar.selectbox("Category:", ["All"] + sorted(df["Category"].dropna().unique().tolist()))
priority = st.sidebar.multiselect("Priority:", sorted(df["Priority"].dropna().unique().tolist()))
date_range = st.sidebar.date_input("Date Range:", [df["Created Date"].min(), df["Created Date"].max()])
search_text = st.sidebar.text_input("Search Incident ID or Description:")

# Apply Filters
filtered_df = df.copy()
if category != "All":
    filtered_df = filtered_df[filtered_df["Category"] == category]
if priority:
    filtered_df = filtered_df[filtered_df["Priority"].isin(priority)]
filtered_df = filtered_df[
    (filtered_df["Created Date"] >= pd.Timestamp(date_range[0])) & 
    (filtered_df["Created Date"] <= pd.Timestamp(date_range[1]))
]
if search_text:
    filtered_df = filtered_df[filtered_df.astype(str).apply(lambda row: row.str.contains(search_text, case=False).any(), axis=1)]

# Key Performance Indicators (KPIs)
st.markdown("## Key Performance Indicators")
col1, col2, col3 = st.columns(3)

with col1:
    st.metric("Total Incidents", f"{len(filtered_df):,}", help="Total number of incidents in the selected period.")

with col2:
    avg_res_time = filtered_df["Resolution Time (Days)"].mean()
    st.metric("Avg Resolution Time", f"{avg_res_time:.2f} days", help="Average time taken to resolve incidents.")

with col3:
    open_incidents = len(filtered_df[filtered_df["Status"] != "Resolved"])
    st.metric("Open Incidents", f"{open_incidents:,}", help="Total number of unresolved incidents.")

st.markdown("---")

# Tabs for better navigation
tab1, tab2, tab3, tab4 = st.tabs(["Status Distribution", "Resolution Time", "Incident Trends", "Data Table"])

# Incident Status Distribution
with tab1:
    st.markdown("### Incident Status Distribution")
    fig_status = px.pie(filtered_df, names="Status", title="Incident Status Breakdown", 
                        color_discrete_sequence=px.colors.sequential.Plasma, template="plotly_dark")
    st.plotly_chart(fig_status, use_container_width=True)

# Resolution Time Analysis
with tab2:
    st.markdown("### Resolution Time by Priority")
    fig_resolution = px.box(filtered_df, x="Priority", y="Resolution Time (Days)", color="Priority",
                            title="Resolution Time Analysis", template="seaborn")
    st.plotly_chart(fig_resolution, use_container_width=True)

# Incident Trend Over Time
with tab3:
    st.markdown("### Incident Trend Over Time (Area Chart)")
    trend_data = filtered_df.groupby("Created Month").size().reset_index(name="Incident Count")
    fig_trend = px.area(trend_data, x="Created Month", y="Incident Count", 
                         title="Incidents Created Over Time",
                         color_discrete_sequence=["#FFA500"], template="seaborn")
    st.plotly_chart(fig_trend, use_container_width=True)

    st.markdown("### Incident Trends by Day of the Week")
    day_counts = filtered_df["Created Day"].value_counts().reset_index()
    day_counts.columns = ["Created Day", "Incident Count"]
    fig_day = px.area(day_counts, x="Created Day", y="Incident Count", 
                      title="Incidents Created by Day",
                      color_discrete_sequence=["#636EFA"], template="plotly_white")
    st.plotly_chart(fig_day, use_container_width=True)

# Enhanced Data Table with Search & Export
with tab4:
    st.markdown("## Detailed Data View")
    
    # Collapsible section for better user experience
    with st.expander("View Filtered Data"):
        st.dataframe(
            filtered_df.style.map(
                lambda x: "background-color: #ffdddd" if isinstance(x, (int, float)) and x > 10 else "",
                subset=["Resolution Time (Days)"]
            ).format({"Resolution Time (Days)": "{:.2f}"})
        )

    # Download Button for Exporting Data
    st.download_button(
        label="Download Data as CSV",
        data=filtered_df.to_csv(index=False).encode("utf-8"),
        file_name="filtered_incidents_data.csv",
        mime="text/csv"
    )
