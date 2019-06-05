package cmd

import (
	"errors"
	"fmt"

	"github.com/spf13/cobra"
)

var deleteCmd = &cobra.Command{
	Use:   "delete [message Id]",
	Short: "Delete a message",
	Long:  "Delete  a message with the provided id",
	Args: func(cmd *cobra.Command, args []string) error {
		if len(args) != 1 {
			return errors.New("requires a message ID to be deleted")
		}
		return nil
	},
	Run: deleteMessage,
}

func init() {
	RootCmd.AddCommand(deleteCmd)
}

func deleteMessage(cmd *cobra.Command, args []string) {
	_, err := rClient.DeleteMessage(args[0])
	if err != nil {
		fmt.Println("Cannot delete the message.", err)
		return
	}
	fmt.Println("The message [" + args[0] + "] has been deleted")
}
