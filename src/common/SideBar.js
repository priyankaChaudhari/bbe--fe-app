import styled from 'styled-components';
import Theme from '../theme/Theme';

const SideBar = styled.div`
  min-width: 80px;
  max-width: 300px;
  position: absolute;
  top:80px;
  right: 0;
  min-height:100%;
  // z-index: 98;
  background: ${Theme.white};
  border-left:1px solid  ${Theme.gray7};
 

  .activity-icon {
    background-color:${Theme.gray15};
    width: 40px;
    height: 40px;
    border-radius: 50%;

    img{
      margin-top: 13px;
      width: 24px;
    }
  }

  input[data-function*='swipe'] {
    position: absolute;
    opacity: 0;
  }
  label[data-function*='swipe'] {
    padding 30px 0 0 10px;
    z-index: 1;
    display: block;
    width: 42px;
    font-family: ${Theme.titleFontFamily};
    height: 42px;
    text-align: center;
    cursor: pointer;
    transform: translate3d(0, 0, 0);
    transition: transform 0.3s;
  }
  
  input[data-function*='swipe']:checked ~ label[data-function*='swipe'] {
    transform: translate3d(200px, 0, 0);
  }
  label[data-function*='swipe']:checked {
    display: block;
  }
  label:nth-child(2) {
    display: none;
  }
  input[data-function*='swipe']:checked ~ label:nth-child(2) {
    display: block;
    transform: translate3d(10px, 0px, 0px);
  }
  input[data-function*='swipe']:checked ~ label:nth-child(3) {
    display: none;
  }
  
  input[data-function*='swipe']:checked ~ .sidebar {
    transform: translate3d(0px, 0px, 0px);
    display: none;
  }
  input[data-function*='swipe']:checked ~ .sidebar .menu li {
    width: 70%;
  }
 
  .sidebar {
    background:${Theme.white};
    padding-top: 45px;
    right: 0;
    transition: all 0.3s;

   .menu{
     padding:0;
     margin:0;
      li {
        color:${Theme.white};
        text-align: center;
        font-size: ${Theme.normal};
        font-weight: 900;
        list-style: none;
        display: flex;
        text-decoration: none;
        padding: 15px 15px 15px 20px;
        border-bottom: 1px solid ${Theme.gray5};
        &:last-child {
          border-bottom:none;
        }

        .activity-user {
          font-size: ${Theme.normal};
          color:${Theme.gray90};
          float: left;
          max-width: 240px;
          word-wrap: break-word;
          text-align: left;

          span {
            color:${Theme.gray35};
          
          }
        }

        img {
          width: 25px;
          height: 25px;
          border-radius: 50%;
          float: left;
          margin-right: 13px;
        }

        .avatar {
          height: 26px;
          border-radius: 50%;
          float: left;
          margin-right: 13px;
          text-align: center;
          border: 1px solid ${Theme.lightOrange};
          background: ${Theme.lightOrange};
          color:${Theme.orange};
          text-transform: Uppercase;
          font-size: ${Theme.extraSmall};
          padding-top: 5px;
          max-width: 26px;
          width: 100%;
          max-height: 26px;
        }

        .time-date {
          color:${Theme.gray35};
          font-size: ${Theme.small};
          text-align: left;
        }

        &:hover {
          box-shadow: ${Theme.commonShadow};
        }
      }
    }
  }
  .activity-log {
    font-size: ${Theme.extraSmall};
    position: absolute;
    width: 185px;
    color:${Theme.gray30};
    top: 40px;
    text-transform: uppercase;
  }

  @media only screen and (min-width: 1500px)  {
     max-width: 350px;
    .sidebar {
        .menu {
          li{
            .activity-user {
              max-width: 320px;
          }
        }
    }
  }
   @media only screen and (min-width: 1700px) and (max-width: 1920px) { 
    max-width: 380px;
    .sidebar {
        .menu {
          li{
             font-size: ${Theme.normalRes};
            .activity-user {
              max-width: 350px;
              font-size: ${Theme.normalRes};
            }
            .avatar {
              width: 46px;
              height: 26px;
              border-radius: 50%;
              float: left;
              margin-right: 13px;
              text-align: center;
              border: 1px solid ${Theme.lightOrange};
              background: ${Theme.lightOrange};
              color:${Theme.orange};
              text-transform: Uppercase;
              font-size: ${Theme.extraSmallRes}; 
            }
            .time-date {
              font-size: ${Theme.smallRes};
            }
          }
        }
        
      }
     .activity-log {
        font-size: ${Theme.extraSmallRes}; 
      }
   }
`;

export default SideBar;
