package cmd

import (
	"errors"
	"fmt"

	"github.com/spf13/cobra"
)

var createCmd = &cobra.Command{
	Use:   "create [message]",
	Short: "Create a message",
	Long:  "Create a message with the given text and using POST method",
	Args: func(cmd *cobra.Command, args []string) error {
		if len(args) != 1 {
			return errors.New("requires a message to be created")
		}
		return nil
	},
	Run: createMessage,
}

func init() {
	RootCmd.AddCommand(createCmd)
}

func createMessage(cmd *cobra.Command, args []string) {

	fmt.Println(args)
}
