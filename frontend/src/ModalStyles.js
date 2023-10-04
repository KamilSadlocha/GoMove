const loginFormModalStyles = {
    content: {
        position: 'absolute',
        background: 'white',
        top: "30%",
        left: "35%",
        height: "38vh",
        width: "30vw",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        border: "4px solid #90ee90",
        color: "90ee90",
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        transition: "top 0.5s"
    }
};

const smallModalStyles = {
    content: {
        position: "absolute",
        display: "flex",
        background: "white",
        flexDirection: "column",
        height: "9vh",
        top: "10%",
        left: "35%",
        transition: "height 0.5s, top 0.5s",
        border: "4px solid #90ee90",
        borderRadius: "8px",
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)",
        textAlign: "center",
        maxWidth: "400px",
    }
};

const activityDeletedModalStyles = {
    content: {
        position: 'absolute',
        background: 'white',
        top: "10%",
        left: "35%",
        height: "25vh",
        width: "30vw",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        border: "4px solid #90ee90",
        color: "90ee90",
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        transition: "height 0.5s, top 0.5s"
    }
};

const additionalProfileInfoModalStyles = {
    content: {
        position: "absolute",
        display: "flex",
        background: "white",
        flexDirection: "column",
        height: "20%",
        top: "30%",
        left: "35%",
        transition: "height 0.5s, top 0.5s",
        border: "4px solid #90ee90",
        borderRadius: "8px",
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)",
        textAlign: "center",
        maxWidth: "400px",
    }
};

const updateUserInfoModalStyles = {
    content: {
        position: "absolute",
        display: "flex",
        background: "white",
        flexDirection: "column",
        height: "20%",
        top: "30%",
        left: "35%",
        transition: "height 0.5s, top 0.5s",
        border: "4px solid #90ee90",
        borderRadius: "8px",
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)",
        textAlign: "center",
        maxWidth: "400px",
    }
};
const noMoreActivitiesModalStyles = {
    content: {
        position: "absolute",
        display: "flex",
        background: "white",
        flexDirection: "column",
        height: "10%",
        width: "30vw",
        top: "5%",
        left: "35%",
        transition: "height 0.5s, top 0.5s",
        border: "4px solid #90ee90",
        borderRadius: "8px",
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)",
        textAlign: "center",
        maxWidth: "400px",
    }
}

const joinedActivityModalStyles = {
    content: {
        position: "absolute",
        display: "flex",
        background: "white",
        flexDirection: "column",
        height: "10%",
        width: "30vw",
        top: "5%",
        left: "35%",
        transition: "height 0.5s, top 0.5s",
        border: "4px solid #90ee90",
        borderRadius: "8px",
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)",
        textAlign: "center",
        maxWidth: "400px",
    }
}
export default {loginFormModalStyles, smallModalStyles, activityDeletedModalStyles, additionalProfileInfoModalStyles, updateUserInfoModalStyles, noMoreActivitiesModalStyles, joinedActivityModalStyles};

