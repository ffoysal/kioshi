package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

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

// Execute adds all child commands to the root command and sets flags appropriately.
// This is called by main.main(). It only needs to happen once to the rootCmd.
func Execute() {
	if err := RootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

func getMmsURI() string {
	uri := os.Getenv("MMS_URI")
	if uri == "" {
		fmt.Println("Please the env MMS_URI (.i.e. http://localhost:3000/")
		os.Exit(1)
	}
	return uri
}
