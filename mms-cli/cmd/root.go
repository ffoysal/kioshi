package cmd

import (
	"fmt"
	"net/http"
	"os"

	"github.com/ffoysal/kioshi/mms-cli/client"

	"github.com/spf13/cobra"
)

var rClient *client.RestClient

// RootCmd represents the base command when called without any subcommands
var RootCmd = &cobra.Command{
	Use:   "mms-cli",
	Short: "mms-cli is a client tool for rest api Message Management Service (mms)",
	Long: `
	mms-cli is a client tool for rest api Message Management Service (mms).
	You can create, get, delete, update, list messages. Set env MMS_URI. 
	example of MMS_URI=http://localhost:3000/
	`,
	// Uncomment the following line if your bare application
	// has an action associated with it:
	//	Run: func(cmd *cobra.Command, args []string) { },
}

// init initialize the default rest client
func init() {
	rClient = &client.RestClient{
		MessagesResourceURI: getMmsURI() + "/messages",
		HealthResoruceURI:   getMmsURI() + "/health",
		HTTPClient:          &http.Client{},
	}
}

// Execute adds all child commands to the root command and sets flags appropriately.
// This is called by main.main(). It only needs to happen once to the rootCmd.
func Execute() {
	if err := RootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

// getMmsURI read api uri from env
func getMmsURI() string {
	uri := os.Getenv("MMS_URI")
	if uri == "" {
		fmt.Println("Please the env MMS_URI (.i.e. export MMS_URI=http://localhost:3000")
		os.Exit(1)
	}
	return uri
}
