const type = localStorage.getItem('theme') || 'light'

export default {
  type: type,
  overrides: {
    MuiCheckbox: {
      root: {
        padding: 0,
        color: '#afb7c7',
        '&$checked': {
          color: '#6bb9ff !important'
        }
      },
      checked: {}
    },
    MuiTableRow: {
      head: {
        height: 45
      }
    },
    MuiTableCell: {
      root: {
        borderBottomColor: '#e4e9f3'
      },
      head: {
        paddingTop: 0,
        paddingBottom: '8px',
        verticalAlign: 'bottom',
        fontSize: '0.9375rem',
        color: '#74809a'
      },
      body: {
        paddingTop: '33px',
        paddingBottom: '33px',
        fontSize: '0.875rem',
        color: '#040d37'
      },
      paddingCheckbox: {
        paddingLeft: '21px'
      }
    },
    MuiLink: {
      root: {
        display: 'inline-block'
      }
    },
    MuiPaper: {
      rounded: {
        borderRadius: '8px'
      }
    },
    MuiToggleButton: {
      root: {
        lineHeight: 'normal'
      }
    }
  },
  palette: {
    light: {
      default: '#fff',
      secondary: '#F4F4F7',
      body: {
        background: '#f9fafc'
      },
      header: {
        borderColor: '#e6eaf4',
        shadow: {
          f: '#F4F4F7',
          s: '#EEEEEF'
        },
        navItem: {
          color: '#888996',
          activeColor: '#102046'
        },
        rightAction: {
          iconColor: '#9394A0'
        },
        account: {
          color: '#888996'
        }
      },
      dropdown: {
        background: '#fff',
        borderColor: '#e6eaf4',
        shadow: '#b6bac6',
        listItem: {
          background: '#fff',
          color: '#74809a',
          border: '#f5f6fa',
          hover: {
            background: 'rgba(230, 234, 244, 0.15)',
            color: '#047abc'
          }
        }
      },
      card: {
        background: '#fff',
        shadow: '#f4f6fb',
        titleColor: '#2c2d3a',
        greyHeader: {
          background: '#f5f6fa',
          color: '#0f2147',
          border: '#e4e9f3'
        },
        flatHeader: {
          color: '#0f2147'
        }
      },
      groupCard: {
        background: '#f9fafc',
        titleColor: '#1575bc',
        border: '#e6eaf4',
        shadow: '#e1e3ec',
        item: {
          label: '#000',
          button: {
            color: '#74809a'
          }
        },
        button: {
          color: '#0a83c8'
        },
        dropdown: {
          border: '#e4e9f3',
          background: '#f5f6fa',
          color: '#0f2147',
          content: {
            background: '#fff',
            color: '#000'
          }
        }
      },
      deviceCard: {
        border: '#e6eaf4',
        shadow: '#e1e3ec',
        header: {
          background: '#f9fafc'
        },
        row: {
          background: '#f5f6fa',
          value: '#0f2147'
        },
        button: {
          color: '#0a83c8'
        },
        footer: {
          background: '#f9fafc'
        }
      },
      templateCreate: {
        background: '#fff'
      },
      templateCard: {
        border: '#e6eaf4',
        shadow: '#e1e3ec',
        header: {
          background: '#f9fafc'
        },
        footer: {
          background: '#f9fafc'
        }
      },
      tagCard: {
        background: '#fff',
        shadow: 'rgba(228, 233, 243, 0.62)',
        border: '#e6eaf4',
        label: {
          color: '#040d37'
        },
        item: {
          color: '#040d37',
          background: 'rgba(240, 243, 249, 0.4)'
        },
        button: {
          color: '#74809a'
        }
      },
      weatherCard: {
        color: '#888996',
        tempColor: '#2c2d3a'
      },
      directionToggle: {
        color: '#606066'
      },
      charts: {
        bandwidth: {
          titleColor: '#000',
          leftLabel: {
            color: '#0f2147'
          }
        },
        devices: {
          countColor: '#000'
        },
        weather: {
          background: '#fff'
        }
      },
      tabs: {
        background: '#fff',
        toggleButton: {
          background: '#fff',
          color: '#606066',
          border: '#e4e9f3'
        }
      },
      roundedTabs: {
        background: '#fff'
      },
      list: {
        background: '#fff',
        item: {
          color: '#888996',
          colorActive: '#102046'
        }
      },
      buttons: {
        white: {
          color: '#74809a',
          background: '#fff',
          border: '#d8deea',
          shadow: 'rgba(216, 222, 234, 0.5)',
          hover: {
            color: '#006198',
            border: '#006198'
          }
        }
      },
      pageContainer: {
        background: '#fff',
        border: '#e6eaf4',
        shadow: '#e1e3ec',
        header: {
          background: '#f5f6fa',
          border: '#E4E9F4',
          titleColor: '#000',
          selecting: '#EFF0F4',
          infoIcon: {
            border: '#e4e9f3',
            color: '#afb7c7'
          },
          button: {
            iconColor: '#0a83c8'
          }
        },
        subHeader: {
          background: '#f9fafc',
          border: '#E4E9F4'
        }
      },
      tableLibrary: {
        paper: {
          background: '#fff'
        },
        head: {
          label: {
            colorHover: '#000'
          },
          iconColor: '#afb7c7'
        },
        body: {
          row: {
            background: '#fff',
            hover: '#fff',
            button: {
              background: '',
              color: '',
              border: ''
            },
            dropdown: {
              background: '#fff',
              shadow: '#b6bac6',
              list: {
                background: '#fff'
              }
            }
          },
          cell: {
            color: '#040d37',
            border: '#e4e9f3'
          }
        },
        footer: {
          background: '#f9fafc',
          pagination: {
            border: '#e4e9f3',
            button: {
              background: '',
              border: '',
              color: '#74809a',
              shadow: 'rgba(216, 222, 234, 0.5)'
            }
          }
        }
      },
      table: {
        head: {
          background: 'rgba(175, 183, 199, 0.5)',
          color: '#000',
          border: '#e4e9f3'
        },
        body: {
          row: {
            selected: {
              background: 'rgba(175, 183, 199, 0.25)'
            }
          },
          cell: {
            color: '#9394A0'
          }
        }
      },
      checkbox: {
        color: ''
      },
      formControls: {
        input: {
          background: '#fff',
          border: '#ced4da',
          color: '#9394A0'
        },
        disabled: {
          background: 'rgb(235, 235, 228)',
          color: 'rgb(84, 84, 84)'
        },
        label: {
          color: 'rgba(0, 0, 0, 0.54)',
          activeColor: '#303f9f'
        },
        multipleTimePicker: {
          input: {
            background: '#fff',
            border: '#d4dce7',
            color: '#4c5057'
          },
          label: {
            color: '#4c5057'
          }
        },
        multipleDatesPicker: {
          border: '#f5f6fa'
        },
        select: {
          background: '#fff',
          border: '#E4E9F3',
          color: '#494F5C',
          shadow: '#B6BAC6',
          active: {
            background: '#F8FBFF !important'
          }
        },
        placeholder: {
          color: '#9394a0'
        },
        timeDuration: {
          item: {
            color: '#000'
          }
        }
      },
      sideModal: {
        background: '#fff',
        header: {
          titleColor: '#0f2147'
        },
        footer: {
          backgroundColor: '#F9FAFC',
          border: '#d7dde3'
        },
        content: {
          border: '#e4e9f3'
        },
        action: {
          background: '#f5f6fa',
          border: '#f5f6fa',
          button: {
            color: '#818ca4',
            background: 'linear-gradient(to right, #ffffff, #fefefe)',
            border: '#cbd3e3'
          }
        },
        switcher: {
          label: {
            color: '#000'
          }
        },
        tabs: {
          header: {
            background: '#f9fafc',
            border: '#e6eaf4'
          },
          item: {
            titleColor: '#040d37'
          }
        },
        groups: {
          header: {
            background: '#f5f6fa',
            titleColor: '#0f2147'
          },
          button: {
            border: '#d8deea',
            background: '#f9fafc',
            color: '#535d73'
          }
        }
      },
      modal: {
        background: '#fff',
        shadow: '#b6bac6'
      },
      sideTab: {
        selected: {
          background: '#fff',
          color: '#0a83c8'
        }
      },
      singleIconTab: {
        color: '#9394a0',
        hover: {
          color: '#000'
        }
      },
      mediaInfo: {
        card: {
          background: 'rgba(245, 246, 250, 0.5)',
          titleInfo: '#4c5057'
        }
      },
      loader: {
        color: '#000',
        background: '#f5f6f7',
        foreground: '#eee'
      },
      suggestionBox: {
        background: '#fff',
        title: '#000',
        subtitle: '#74809A'
      },
      pages: {
        dashboard: {
          card: {
            border: '#e4e9f3'
          }
        },
        accountSettings: {
          button: {
            iconColor: '#757575'
          },
          content: {
            background: '#fff',
            border: '#e4e9f3'
          },
          accountInfo: {
            color: '#0f2147'
          },
          card: {
            iconColor: '#757575',
            border: '#e4e9f3'
          },
          clientDetails: {
            row: {
              border: '#f5f6fa',
              valueColor: '#0f2147'
            }
          },
          bandwidth: {
            leftLabel: {
              color: '#0f2147'
            }
          }
        },
        adminSettings: {
          content: {
            border: '#e4e9f3'
          }
        },
        users: {
          addUser: {
            titles: {
              color: '#0f2147'
            },
            fab: {
              background: '#fcfcfc',
              border: '#e4e9f3'
            },
            border: '#e4e9f3',
            button: {
              color: '#818ca4',
              background: 'linear-gradient(to right, #ffffff, #fefefe)',
              border: '#cbd3e3'
            }
          }
        },
        packages: {
          sideModal: {
            item: {
              border: '#f5f6fa'
            }
          }
        },
        rss: {
          addRss: {
            upload: {
              background: 'linear-gradient(to bottom, #ffffff, #fafbfd)',
              border: 'rgba(228, 233, 243, 0.23)',
              titleColor: '#0f2147',
              button: {
                background: 'linear-gradient(to bottom, #e4e9f3, #cdd4e4)',
                color: '#74809a',
                border: '#e4e9f3'
              }
            },
            editorToolbar: {
              border: 'rgba(228, 233, 243, 0.5)',
              background: 'rgba(245, 246, 250, 0.5)'
            },
            manage: {
              border: '#e4e9f3',
              background: 'rgba(245, 246, 250, 0.6)',
              titleColor: '#74809a',
              category: {
                color: '#040d37'
              }
            }
          }
        },
        oem: {
          addClient: {
            item: {
              border: '#f5f6fa'
            },
            features: {
              item: {
                color: '#000'
              }
            },
            actions: {
              background: '#f5f6fa',
              border: '#f5f6fa'
            }
          }
        },
        banners: {
          preview: {
            border: '#e4e9f3'
          }
        },
        clients: {
          addClient: {
            button: {
              iconColor: '#0a83c8'
            }
          }
        },
        devices: {
          alerts: {
            tabs: {
              card: {
                header: {
                  background: '#f5f6fa'
                }
              },
              recordInfo: {
                background: 'rgba(245, 246, 250, 0.3)',
                color: '#0a83c8'
              }
            },
            mediaModal: {
              cap: {
                password: {
                  background: '#f5f6fa'
                }
              }
            }
          },
          groups: {
            item: {
              color: '#74809a'
            }
          },
          rebootModal: {
            title: {
              color: '#000'
            },
            info: {
              label: {
                color: '#000'
              },
              value: {
                color: '#000'
              }
            }
          }
        },
        smartPlaylist: {
          card: {
            background: 'linear-gradient(to bottom, #ffffff, #fafbfd)',
            titleColor: '#040d37',
            root: {
              background: '#fefeff'
            },
            button: {
              color: '#0a83c8'
            }
          }
        },
        fonts: {
          background: '#fff',
          border: '#e4e9f3',
          header: {
            background: 'rgba(245, 246, 250, 0.2)',
            input: {
              background: 'rgba(245, 246, 250, 0.2)'
            }
          },
          item: {
            color: '#333',
            fontName: {
              color: '#000'
            }
          },
          footer: {
            background: '#f9fafc',
            border: '#e4e9f3'
          }
        },
        createTemplate: {
          border: '#e4e9f3',
          types: {
            background: 'linear-gradient(to bottom, #fff, #fafbfd)',
            item: {
              color: '#000',
              hover: {
                color: '#1c5dca'
              }
            }
          },
          template: {
            viewContainer: {
              border: 'linear-gradient(132deg, #e4e9f3, #e4e9f3 77%, #e4e9f3)',
              background: '#fff'
            },
            footer: {
              background: 'linear-gradient(to bottom, #fff, #fafbfd)'
            }
          },
          footer: {
            background: '#f5f6fa'
          },
          settings: {
            expansion: {
              header: {
                background: 'linear-gradient(to left, #fdfefe, #f8f9fc)',
                color: '#000'
              },
              body: {
                background: '#fff',
                formControl: {
                  color: '#4c5057'
                },
                icon: {
                  color: '#000'
                }
              }
            }
          },
          modal: {
            item: {
              color: '#000'
            }
          },
          zoomToFit: {
            color: '#000'
          }
        },
        schedule: {
          boldTitle: '#4c5057',
          timeline: {
            icon: '#afb7c7',
            title: '#000',
            border: '#E4E9F4',
            background: '#f5f6fa',
            header: {
              icon: '#0a83c8'
            },
            device: {
              background: '#f5f6fa'
            }
          }
        },
        reports: {
          generate: {
            border: '#e4e9f3',
            background: '#F5F6FA',
            color: '#0f2147',
            dataTables: {
              divider: {
                background: 'linear-gradient(180deg, #F3F6FA 0%, #E4E9F3 100%)'
              },
              item: {
                border: '#e4e9f3',
                background: '#fdfdfe',
                color: '#8a8ea3'
              }
            },
            filters: {
              item: {
                border: '#b6cedb',
                background: '#fff',
                titleColor: '#53627c',
                textColor: '#2c2c2c',
                indexColor: '#424242'
              }
            },
            popup: {
              color: '#2c2c2c',
              toggleItems: {
                border: '#d8deea',
                background: '#fff'
              },
              chartType: {
                border: '#c8d3e8',
                background: '#f7f9ff'
              }
            },
            info: {
              chart: {
                labelColor: '#000',
                subColor: 'rgba(0, 0, 0, 0.25)'
              }
            },
            iconColor: '#000'
          },
          report: {
            color: '#102046',
            table: {
              border: '#E4E9F3',
              head: {
                background: '#F5F6FA'
              },
              cell: {
                background: '#fff',
                first: {
                  background: '#F9FAFC'
                },
                hover: {
                  background: '#F0F4FB'
                }
              }
            }
          }
        },
        media: {
          card: {
            border: '#e4e9f3',
            background: 'rgba(245, 246, 250, 0.5)',
            header: {
              background: 'rgba(245, 246, 250, 0.5)',
              color: '#4c5057'
            }
          },
          general: {
            card: {
              border: '#e4e9f3',
              background: 'rgba(245, 246, 250, 0.5)',
              header: {
                background: 'rgba(245, 246, 250, 0.5)',
                color: '#4c5057'
              }
            },
            chart: {
              types: {
                color: '#4C5057',
                background: '#FFFFFF',
                active: {
                  color: '#0A83C8',
                  background: '#FFFFFF'
                },
                sub: {
                  color: '#4C5057',
                  active: {
                    background: '#f3f9fc',
                    color: '#0A83C8'
                  }
                }
              }
            }
          },
          local: {
            card: {
              color: '#000000',
              background: '#FAFBFD',
              border: '#D4DCE7',
              header: {
                background: 'linear-gradient(270deg, #FDFEFE 0%, #F8F9FC 100%)'
              },
              input: {
                label: {
                  color: '#4C5057'
                }
              }
            }
          },
          gallery: {
            poster: {
              border: '#CBD3E3',
              background: '#FAFAFD',
              header: {
                color: '#9394A0'
              }
            },
            quote: {
              color: '#4C5057',
              background: '#F9FAFC'
            }
          },
          premium: {
            color: '#000000',
            currency: {
              background: '#F5F6FA'
            }
          },
          licenced: {
            color: '#000'
          },
          custom: {
            color: '#000'
          }
        },
        singIn: {
          background: '#fff',
          color: '#000',
          border: '#ddddde',
          subtitle: '#9394a0',
          social: {
            facebook: '#4469a2',
            linkedIn: '#0078ba'
          }
        },
        profile: {
          passwords: {
            background: '#F3F5F7'
          }
        },
        tags: {
          add: {
            label: {
              color: 'rgba(0, 0, 0, 0.54)'
            }
          }
        },
        rbac: {
          background: '#FFF',
          emphasis: '#000',
          primary: '#74809A',
          disabled: '#EBEBE4',
          border: '#E6EAF4',
          shadow: '0 1px 2px 1px #E4E9F3',
          header: {
            background: '#F5F6FA',
            border: '#E4E9F4'
          },
          roles: {
            hover: {
              color: '#0A83C8'
            },
            active: {
              background: '#F5FbFF',
              color: '#0A83C8'
            },
            chip: {
              background: '#FFF',
              color: '#74809A',
              border: '#D8DEEA',
              shadow: '0 1px 0 0 #D8DEEA50'
            }
          },
          group: {
            border: '#E4E9F4',
            color: '#000'
          },
          toggle: {
            border: '#E4E9F4'
          }
        }
      },
      daysCheckbox: {
        background: '#ddddde',
        active: '#5d5960',
        titleColor: '#000'
      },
      scheduleSelector: {
        root: {
          border: '#ddddde',
          background: '#fff'
        },
        dialogTitle: {
          color: '#808B9C'
        },
        labelInterval: {
          color: '#0f2147'
        }
      },
      dialog: {
        background: '#fff',
        header: {
          color: '#040d37',
          background: '#f5f6fa'
        },
        closeButton: '#040d37',
        border: '#E4E9F4',
        title: '#040d37',
        subtitle: '#040d3799',
        text: '#9394A0',
        shadow: '#000000'
      },
      languageSelector: {
        background: '#fff',
        color: '#888996'
      }
    },
    dark: {
      default: '#0A1526',
      secondary: '#15263D',
      body: {
        background: '#0A1526'
      },
      header: {
        borderColor: '#000',
        shadow: {
          f: '#000',
          s: '#15263D'
        },
        navItem: {
          color: '#8993A3',
          activeColor: '#8993A3'
        },
        rightAction: {
          iconColor: '#5C697F'
        },
        account: {
          color: '#8993A3'
        }
      },
      dropdown: {
        background: '#15263D',
        borderColor: '#162949',
        shadow: '#000000',
        listItem: {
          background: '#15263D',
          color: '#74809A',
          border: '#0A1526',
          hover: {
            background: 'rgba(230, 234, 244, 0.15)',
            color: '#fff'
          }
        }
      },
      card: {
        background: '#15263D',
        shadow: '#0A1526',
        titleColor: '#8993A3',
        greyHeader: {
          background: '#15263D',
          color: '#808B9C',
          border: '#162949'
        },
        flatHeader: {
          color: '#808B9C'
        }
      },
      groupCard: {
        background: '#0A1526',
        titleColor: '#8993A3',
        border: '#1E3966',
        shadow: '#1E3966',
        item: {
          label: '#fff',
          button: {
            color: '#fff'
          }
        },
        button: {
          color: '#fff'
        },
        dropdown: {
          border: '#1E3966',
          background: '#0A1526',
          color: '#808B9C',
          content: {
            background: '#15263D',
            color: '#fff'
          }
        }
      },
      deviceCard: {
        border: '#162949',
        shadow: '#15263D',
        header: {
          background: '#0A1526'
        },
        row: {
          background: '#162949',
          value: '#808B9C'
        },
        button: {
          color: '#fff'
        },
        footer: {
          background: '#162949'
        }
      },
      templateCreate: {
        background: '#9394A0'
      },
      templateCard: {
        border: '#0A1526',
        shadow: '#0A1526',
        header: {
          background: '#0A1526'
        },
        footer: {
          background: '#0A1526'
        }
      },
      tagCard: {
        background: '#162949',
        shadow: '',
        border: '#15263D',
        label: {
          color: '#fff'
        },
        item: {
          color: '#808B9C',
          background: '#0A1526'
        },
        button: {
          color: '#74809a'
        }
      },
      weatherCard: {
        color: '#8993A3',
        tempColor: '#fff'
      },
      directionToggle: {
        color: '#fff'
      },
      charts: {
        bandwidth: {
          titleColor: '#fff',
          leftLabel: {
            color: '#808B9C'
          }
        },
        devices: {
          countColor: '#fff'
        },
        weather: {
          background: '#15263D'
        }
      },
      tabs: {
        background: 'transparent',
        toggleButton: {
          background: '#343D4E',
          color: '#fff',
          border: '#343D4E'
        }
      },
      roundedTabs: {
        background: '#15263D'
      },
      list: {
        background: '#15263D',
        item: {
          color: '#8993A3',
          colorActive: '#8993A3'
        }
      },
      pageContainer: {
        background: '#0A1526',
        border: '#162949',
        shadow: '#162949',
        header: {
          background: '#15263D',
          border: '#15263D',
          titleColor: '#fff',
          selecting: '#172B44',
          infoIcon: {
            border: '#0A1526',
            color: '#5C697F'
          },
          button: {
            iconColor: '#fff'
          }
        },
        subHeader: {
          background: 'rgba(21, 38, 61, 0.64)',
          border: '#162949'
        }
      },
      buttons: {
        white: {
          color: '#fff',
          background: '#1175BC',
          border: '#1175BC',
          shadow: 'transparent',
          hover: {
            color: '#fff',
            border: '#1175BC'
          }
        }
      },
      tableLibrary: {
        paper: {
          background: '#0A1526'
        },
        head: {
          label: {
            colorHover: '#fff'
          },
          iconColor: '#5C697F'
        },
        body: {
          row: {
            background: '#0A1526',
            hover: '#0A1526',
            button: {
              background: '#5C697F',
              border: '#5C697F',
              color: '#0A1526'
            },
            dropdown: {
              background: '#15263D',
              shadow: '#162949',
              list: {
                background: '#15263D'
              }
            }
          },
          cell: {
            color: '#74809A',
            border: '#162949'
          }
        },
        footer: {
          background: 'rgba(21, 38, 61, 0.64)',
          pagination: {
            border: '#0A1526',
            button: {
              background: '#112034',
              border: '#1E3966',
              color: '#9394A0',
              shadow: 'transparent'
            }
          }
        }
      },
      table: {
        head: {
          background: '#0A1526',
          color: '#fff',
          border: '#162949'
        },
        row: {
          selected: {
            background: 'rgba(10, 21, 38, 0.5)'
          }
        },
        body: {
          cell: {
            color: '#9394A0'
          }
        }
      },
      checkbox: {
        color: '#1E3966'
      },
      formControls: {
        input: {
          background: '#112034',
          border: '#1E3966',
          color: '#9394A0'
        },
        disabled: {
          background: '#172b47',
          color: 'rgb(84, 84, 84)'
        },
        label: {
          color: 'rgba(255, 255, 255, 0.54)',
          activeColor: '#fff'
        },
        multipleTimePicker: {
          input: {
            background: '#112034',
            border: '#1E3966',
            color: '#9394A0'
          },
          label: {
            color: '#9394A0'
          }
        },
        multipleDatesPicker: {
          border: '#1E3966'
        },
        select: {
          background: '#112034',
          border: '#1E3966',
          color: '#9394A0',
          shadow: '#1E3966',
          active: {
            background: '#1E3966 !important'
          }
        },
        placeholder: {
          color: '#9394a0'
        },
        timeDuration: {
          item: {
            color: '#fff'
          }
        }
      },
      sideModal: {
        after: {
          background:
            'linear-gradient(to left, rgba(0, 0, 0, 0.26), rgba(255, 255, 255, 0))'
        },
        background: '#15263D',
        header: {
          titleColor: '#808B9C'
        },
        footer: {
          background: '#112034',
          border: '#1E3966'
        },
        content: {
          border: '#1E3966'
        },
        action: {
          background: '#15263D',
          border: '#1E3966',
          button: {
            color: '#fff',
            background: '#1175BC',
            border: '#1175BC'
          }
        },
        switcher: {
          label: {
            color: 'rgba(255, 255, 255, 0.54)'
          }
        },
        tabs: {
          header: {
            background: '#0A1526',
            border: '#1E3966'
          },
          item: {
            titleColor: '#808B9C'
          }
        },
        groups: {
          header: {
            background: '#15263D',
            titleColor: '#808B9C'
          },
          button: {
            border: '#1175BC',
            background: '#1175BC',
            color: '#fff'
          }
        }
      },
      modal: {
        background: '#15263D',
        shadow: '#1E3966'
      },
      sideTab: {
        selected: {
          background: '#15263D',
          color: '#fff'
        }
      },
      singleIconTab: {
        color: '#8993A3',
        hover: {
          color: '#fff'
        }
      },
      mediaInfo: {
        card: {
          background: '#0A1526',
          titleColor: '#8993A3'
        }
      },
      loader: {
        color: '#fff',
        background: '#15263D',
        foreground: '#1E3966'
      },
      suggestionBox: {
        background: '#15263D',
        title: '#fff',
        subtitle: '#9394A0'
      },
      pages: {
        dashboard: {
          card: {
            border: '#1E3966'
          }
        },
        accountSettings: {
          button: {
            iconColor: '#fff'
          },
          content: {
            background: '#0A1526',
            border: '#162949'
          },
          accountInfo: {
            color: '#808B9C'
          },
          card: {
            iconColor: '#5C697F',
            border: '#162949'
          },
          clientDetails: {
            row: {
              border: '#162949',
              valueColor: '#EFEFEF'
            }
          },
          bandwidth: {
            leftLabel: {
              color: '#808B9C'
            }
          }
        },
        adminSettings: {
          content: {
            border: '#1E3966'
          }
        },
        users: {
          addUser: {
            titles: {
              color: '#808B9C'
            },
            fab: {
              background: '#15263D',
              border: '#1E3966'
            },
            border: '#1E3966',
            button: {
              color: '#fff',
              background: '#1175BC',
              border: '#1175BC'
            }
          }
        },
        packages: {
          sideModal: {
            item: {
              border: '#1E3966'
            }
          }
        },
        rss: {
          addRss: {
            upload: {
              background: '#15263D',
              border: '#1E3966',
              titleColor: 'rgba(255, 255, 255, 0.54)',
              button: {
                background: '#1E3966',
                color: '#fff',
                border: '#1E3966'
              }
            },
            editorToolbar: {
              border: '#1E3966',
              background: '#15263D'
            },
            manage: {
              border: '#1E3966',
              background: '#0A1526',
              titleColor: 'rgba(255, 255, 255, 0.54)',
              category: {
                color: 'rgba(255, 255, 255, 0.54)'
              }
            }
          }
        },
        oem: {
          addClient: {
            item: {
              border: '#1E3966'
            },
            features: {
              item: {
                color: 'rgba(255, 255, 255, 0.54)'
              }
            },
            actions: {
              background: '#15263D',
              border: '#1E3966'
            }
          }
        },
        banners: {
          preview: {
            border: '#1E3966'
          }
        },
        clients: {
          addClient: {
            button: {
              iconColor: '#fff'
            }
          }
        },
        devices: {
          alerts: {
            tabs: {
              card: {
                header: {
                  background: '#0A1526'
                }
              },
              recordInfo: {
                background: '#15263D',
                color: '#fff'
              }
            },
            mediaModal: {
              cap: {
                password: {
                  background: '#0A1526'
                }
              }
            }
          },
          groups: {
            item: {
              color: '#fff'
            }
          },
          rebootModal: {
            title: {
              color: '#fff'
            },
            info: {
              label: {
                color: 'rgba(255, 255, 255, 0.54)'
              },
              value: {
                color: '#fff'
              }
            }
          }
        },
        smartPlaylist: {
          card: {
            background: '#15263D',
            titleColor: '#9394A0',
            root: {
              background: '#0A1526'
            },
            button: {
              color: '#fff'
            }
          }
        },
        fonts: {
          background: '#0A1526',
          border: '#162949',
          header: {
            background: '#0A1526',
            input: {
              background: '#0A1526'
            }
          },
          item: {
            color: '#9394A0',
            fontName: {
              color: '#fff'
            }
          },
          footer: {
            border: '#162949',
            background: 'rgba(21, 38, 61, 0.64)'
          }
        },
        createTemplate: {
          border: '#162949',
          types: {
            background: '#0A1526',
            item: {
              color: '#9394A0',
              hover: {
                color: '#fff'
              }
            }
          },
          template: {
            viewContainer: {
              border: '#162949',
              background: '#fff'
            },
            footer: {
              background: '#0A1525'
            }
          },
          footer: {
            background: '#15263D'
          },
          settings: {
            expansion: {
              header: {
                background: 'linear-gradient(270deg, #0A1526 0%, #15263D 100%)',
                color: '#9394A0'
              },
              body: {
                background: '#15263D',
                formControl: {
                  color: 'rgba(255, 255, 255, 0.54)'
                },
                icon: {
                  color: 'rgba(255, 255, 255, 0.54)'
                }
              }
            }
          },
          modal: {
            item: {
              color: '#fff'
            }
          },
          zoomToFit: {
            color: '#fff'
          }
        },
        schedule: {
          boldTitle: '#9394A0',
          timeline: {
            icon: '#8993A3',
            title: '#fff',
            border: '#15263D',
            background: '#15263D',
            header: {
              icon: '#fff'
            },
            device: {
              background: '#0A1526'
            }
          }
        },
        reports: {
          generate: {
            border: '#162949',
            background: '#0A1526',
            color: '#9394A0',
            dataTables: {
              divider: {
                background: '#162949'
              },
              item: {
                border: '#1E3966',
                background: '#15263D',
                color: '#9394A0'
              }
            },
            filters: {
              item: {
                border: '#1E3966',
                background: '#15263D',
                titleColor: '#9394A0',
                textColor: '#9394A0',
                indexColor: '#fff'
              }
            },
            popup: {
              color: '#9394A0',
              toggleItems: {
                border: '#1E3966',
                background: '#15263D'
              },
              chartType: {
                border: '#1E3966',
                background: '#15263D'
              }
            },
            info: {
              chart: {
                labelColor: '#fff',
                subColor: 'rgba(255, 255, 255, 0.25)'
              }
            },
            iconColor: '#fff'
          },
          report: {
            color: '#9394A0',
            table: {
              border: '#1E3966',
              head: {
                background: '#0A1526'
              },
              cell: {
                background: '#15263D',
                first: {
                  background: '#0A1526'
                },
                hover: {
                  background: ''
                }
              }
            }
          }
        },
        media: {
          card: {
            border: '#1E3966',
            background: '#15263D',
            header: {
              background: '#0A1526',
              color: '#9394A0'
            }
          },
          general: {
            card: {
              border: '#1E3966',
              background: '#15263D',
              header: {
                background: '#0A1526',
                color: '#9394A0'
              }
            },
            chart: {
              types: {
                color: '#9394A0',
                background: '#15263D',
                active: {
                  color: '#0A83C8',
                  background: '#15263D'
                },
                sub: {
                  color: '#9394A0',
                  active: {
                    background: '#0A1526',
                    color: '#0A83C8'
                  }
                }
              }
            }
          },
          local: {
            card: {
              color: '#fff',
              background: '#15263D',
              border: '#1E3966',
              header: {
                background: '#15263D'
              },
              input: {
                label: {
                  color: '#808B9C'
                }
              }
            }
          },
          gallery: {
            poster: {
              border: '#1E3966',
              background: '#15263D',
              header: {
                color: '#808B9C'
              }
            },
            quote: {
              color: '#808B9C',
              background: '#0A1526'
            }
          },
          premium: {
            color: '#fff',
            currency: {
              background: '#15263D'
            }
          },
          licenced: {
            color: '#fff'
          },
          custom: {
            color: '#fff'
          }
        },
        singIn: {
          background: '#15263D',
          color: '#fff',
          subtitle: '#9394a0',
          border: '#1E3966',
          social: {
            facebook: '#fff',
            linkedIn: '#fff'
          }
        },
        profile: {
          passwords: {
            background: '#1E3966'
          }
        },
        tags: {
          add: {
            label: {
              color: 'rgba(255, 255, 255, 0.54)'
            }
          }
        },
        rbac: {
          background: '#0A1526',
          emphasis: '#FFF',
          primary: '#74809A',
          disabled: '#172b47',
          border: '#162949',
          shadow: '0 1px 2px 1px #162949',
          header: {
            background: '#15263D',
            border: '#1E3966'
          },
          roles: {
            hover: {
              color: '#F5FBFF'
            },
            active: {
              background: '#15263D',
              color: '#F5FBFF'
            },
            chip: {
              background: '#5C697F',
              color: '#0A1526',
              border: '#5C697F',
              shadow: 'none'
            }
          },
          group: {
            border: '#1E3966',
            color: '#8993A3'
          },
          toggle: {
            border: '#1E3966'
          }
        }
      },
      daysCheckbox: {
        background: '#1E3966',
        active: '#2d648a',
        titleColor: '#808B9C'
      },
      scheduleSelector: {
        root: {
          border: '#1E3966',
          background: '#15263D'
        },
        dialogTitle: {
          color: '#808B9C'
        },
        labelInterval: {
          color: '#808B9C'
        }
      },
      dialog: {
        background: '#111F33',
        header: {
          color: '#fff',
          background: '#15263D'
        },
        closeButton: '#fff',
        border: '#14263d',
        title: '#fff',
        subtitle: '#ffffff99',
        text: '#9394A0',
        shadow: '#34619B'
      },
      languageSelector: {
        background: '#0A1526',
        color: '#8993A3'
      }
    },
    background: { default: '#f9fafc' }
  },
  typography: {
    useNextVariants: true,
    fontFamily: [
      '"Nunito Sans"',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(',')
  },
  formControls: {
    label: {
      fontSize: 16,
      color: 'rgba(0, 0, 0, 0.54)'
    },
    input: {
      padding: '9px 15px',
      fontSize: 14,
      height: 38
    },
    root: {
      height: 38
    },
    mediaApps: {
      numericInput: {
        input: {
          padding: '9px 15px !important',
          fontSize: '14px !important'
        },
        root: {
          height: '38px !important',
          '& > span': {
            height: '38px !important'
          }
        }
      },
      textInput: {
        input: {
          padding: '9px 15px',
          fontSize: 14,
          height: 38
        }
      },
      selectInput: {
        input: {
          padding: '9px 15px',
          fontSize: 14,
          height: 38
        },
        label: {
          fontSize: 16,
          transform: 'scale(0.75)',
          color: 'rgba(0, 0, 0, 0.54)'
        }
      },
      colorSelect: {
        input: {
          padding: '9px 15px',
          fontSize: 14,
          width: '100%',
          height: 38
        },
        label: {
          fontSize: 16,
          transform: 'scale(0.75)',
          color: 'rgba(0, 0, 0, 0.54)'
        }
      },
      timeDurationPicker: {
        input: {
          padding: '9px 15px',
          fontSize: 14,
          height: 38
        },
        label: {
          fontSize: 16,
          transform: 'scale(0.75)',
          color: 'rgba(0, 0, 0, 0.54)'
        }
      },
      refreshEverySlider: {
        input: {
          width: 70,
          height: 38,
          fontSize: 14
        },
        root: {
          alignItems: 'center'
        },
        label: {
          fontSize: 16,
          transform: 'scale(0.75)',
          color: 'rgba(0, 0, 0, 0.54)'
        }
      }
    }
  }
}
